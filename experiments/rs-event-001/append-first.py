"""Bounded non-normative experiment. Input only on stdin; no fixture/oracle I/O.

Admission-first: validate a candidate eagerly, extend an explicit authoritative
prefix, then replay the resulting stream. This is not a production Boundary.
"""
import json
import re
import sys


MAXIMUM = (1 << 64) - 1
TRANSITIONS = {
    (None, "ACTION_CREATED"): "CREATED",
    ("CREATED", "VALIDATION_STARTED"): "VALIDATING",
    ("VALIDATING", "VALIDATION_SUCCEEDED"): "READY",
    ("READY", "AUTHORIZATION_GRANTED"): "AUTHORIZED",
    ("AUTHORIZED", "EXECUTION_STARTED"): "EXECUTING",
    ("EXECUTING", "EXECUTION_COMPLETED"): "COMPLETED",
    ("EXECUTING", "EXECUTION_FAILED"): "FAILED",
}


def ordinal(text):
    # Decimal strings are local harness transport only; no float conversion.
    if not isinstance(text, str) or not re.fullmatch(r"0|[1-9][0-9]*", text):
        raise ValueError("bad experimental ordinal")
    return int(text)


def ordered(events):
    return sorted(events, key=lambda event: ordinal(event["sequence"]))


def resolve(event, env):
    selections = [x for x in env["identifiers"] if x["type"] == event["event_type"]]
    if len(selections) != 1:
        return "unsupported", None
    material = selections[0]["material"]
    if material not in env["presented"] or material not in env["fixed"]:
        return "unsupported", None
    definition = env["presented"][material]
    fixed = env["fixed"][material]
    if definition != fixed:
        return "invalid", None
    if any(d not in env["available"] for d in definition["dependencies"]):
        return "unsupported", None
    return "supported", definition


def fields(event, env):
    required = ("event_id", "action_id", "event_type", "occurred_at", "sequence", "spec_version")
    if any(k not in event or event[k] is None for k in required):
        return "invalid", None
    if not isinstance(event["event_id"], str) or not re.fullmatch(r"[0-9a-f]{64}", event["event_id"]):
        return "invalid", None
    if event["action_id"] != env["action"]["action_id"]:
        return "invalid", None
    if event["spec_version"] != ["VE-002", "0.2"]:
        return "unsupported", None
    if not 0 <= ordinal(event["sequence"]) <= MAXIMUM:
        return "invalid", None
    status, contract = resolve(event, env)
    if status != "supported":
        return status, None
    domain = env["times"][contract["time"]]
    stamp = event["occurred_at"]
    prefix = domain["date"] + "T" + domain["hourMinute"] + ":"
    if not isinstance(stamp, str) or not re.fullmatch(re.escape(prefix) + r"[0-5][0-9]Z", stamp):
        return "invalid", None
    if "actor" in event:
        actor_ok = contract["actor"] and event["actor"] == "scenario-policy-engine"
        if not actor_ok:
            return "invalid", None
    if "component" in event or "payload" in event:
        return "invalid", None
    references_ok = ("references" not in event) if contract["references"] is None else event.get("references") == contract["references"]
    if not references_ok:
        return "invalid", None
    # Other distinct members, including null, have no semantic effect.
    return "supported", contract


def stream_valid(events):
    seen, previous = set(), -1
    for event in events:
        sequence = ordinal(event["sequence"])
        if event["event_id"] in seen or not previous < sequence <= MAXIMUM:
            return False
        seen.add(event["event_id"])
        previous = sequence
    return True


def run(env):
    # Membership is supplied independently of storage/delivery. Identical
    # redelivery is not another occurrence. Conflicting copies fail locally.
    members = set(env["membership"])
    by_id = {}
    invalid = False
    for event in env["delivery"]:
        identity = event["event_id"]
        if identity not in members:
            continue
        if identity in by_id and event != by_id[identity]:
            invalid = True
        by_id[identity] = event
    invalid |= set(by_id) != members
    history = ordered(list(by_id.values()))
    invalid |= not stream_valid(history)
    rejected = []
    if not invalid:
        for proposal in env["proposals"]:
            event = proposal["event"]
            identity = event["event_id"]
            head = history[-1] if history else None
            # Exhaustion is evaluated even for the E22 append request, which
            # cannot contain a valid next sequence or protected assignment.
            if head and ordinal(head["sequence"]) == MAXIMUM:
                rejected.append(identity)
                continue
            status, _ = fields(event, env)
            assignment = proposal["assignment"]
            selected = assignment is not None and assignment["event_id"] == identity and assignment["predecessor"] == (head["event_id"] if head else None) and assignment["sequence"] == event.get("sequence")
            evidence = proposal["evidenceAdmitted"] and proposal["timeEstablished"]
            allowed = status == "supported" and selected and evidence
            if allowed and stream_valid(history + [event]):
                history.append(event)
            else:
                rejected.append(identity)

    state, unsupported = None, []
    if not invalid:
        for event in history:
            status, contract = fields(event, env)
            if status == "unsupported":
                unsupported.append(event["event_id"])
                continue
            if status != "supported":
                invalid = True
                break
            trigger = contract["trigger"]
            if trigger is not None:
                pair = (state, trigger)
                if pair not in TRANSITIONS:
                    invalid = True
                    break
                state = TRANSITIONS[pair]
    return {"order": [e["event_id"] for e in history], "state": state,
            "rejected": rejected, "unsupported": unsupported,
            "partial": bool(unsupported), "invalid": bool(invalid)}


if __name__ == "__main__":
    print(json.dumps(run(json.load(sys.stdin))))
