#!/usr/bin/env python3
"""External per-attempt watchdog. It never interprets semantic input."""

import argparse
import json
import os
import platform
import resource
import shutil
import signal
import subprocess
import sys
import tempfile
import time


def parser():
    p = argparse.ArgumentParser()
    p.add_argument('--wall-ms', type=int, required=True)
    p.add_argument('--cpu-seconds', type=int, required=True)
    p.add_argument('--memory-bytes', type=int, required=True)
    p.add_argument('--file-bytes', type=int, required=True)
    p.add_argument('--fd-limit', type=int, required=True)
    p.add_argument('--output-bytes', type=int, required=True)
    p.add_argument('--temp-root', required=True)
    p.add_argument('command', nargs=argparse.REMAINDER)
    return p


def fd_count():
    try:
        return len(os.listdir('/dev/fd'))
    except OSError:
        return None


def tree_bytes(path):
    total = 0
    for root, _, files in os.walk(path):
        for name in files:
            try:
                total += os.stat(os.path.join(root, name), follow_symlinks=False).st_size
            except OSError:
                pass
    return total


def main():
    args = parser().parse_args()
    if not args.command:
        raise SystemExit('missing command')
    os.makedirs(args.temp_root, mode=0o700, exist_ok=False)
    before_fds = fd_count()
    limits = {
        'cpu': hasattr(resource, 'RLIMIT_CPU'),
        # macOS exposes RLIMIT_AS but rejects setting it in a pre-exec child.
        # Peak RSS remains measured and checked by the orchestrator there.
        'memory': hasattr(resource, 'RLIMIT_AS') and sys.platform != 'darwin',
        'file': hasattr(resource, 'RLIMIT_FSIZE'),
        'fds': hasattr(resource, 'RLIMIT_NOFILE'),
        'processes': False,
    }

    def constrained_child():
        os.setsid()
        if limits['cpu']:
            resource.setrlimit(resource.RLIMIT_CPU, (args.cpu_seconds, args.cpu_seconds + 1))
        if limits['memory']:
            resource.setrlimit(resource.RLIMIT_AS, (args.memory_bytes, args.memory_bytes))
        if limits['file']:
            resource.setrlimit(resource.RLIMIT_FSIZE, (args.file_bytes, args.file_bytes))
        if limits['fds']:
            resource.setrlimit(resource.RLIMIT_NOFILE, (args.fd_limit, args.fd_limit))

    started = time.monotonic()
    timed_out = False
    launch_error = None
    stdout = b''
    stderr = b''
    output_exceeded = False
    disk_exceeded = False
    peak_temp_bytes = 0
    proc = None
    usage_before = resource.getrusage(resource.RUSAGE_CHILDREN)
    try:
        env = dict(os.environ, TMPDIR=args.temp_root, ADVERSARIAL_TEMP_ROOT=args.temp_root)
        with tempfile.TemporaryFile() as stdout_file, tempfile.TemporaryFile() as stderr_file:
            proc = subprocess.Popen(args.command, stdout=stdout_file, stderr=stderr_file,
                                    env=env, preexec_fn=constrained_child)
            while proc.poll() is None:
                elapsed = (time.monotonic() - started) * 1000
                captured = os.fstat(stdout_file.fileno()).st_size + os.fstat(stderr_file.fileno()).st_size
                temp_bytes = tree_bytes(args.temp_root)
                peak_temp_bytes = max(peak_temp_bytes, temp_bytes)
                if elapsed > args.wall_ms:
                    timed_out = True
                    os.killpg(proc.pid, signal.SIGKILL)
                    break
                if captured > args.output_bytes:
                    output_exceeded = True
                    os.killpg(proc.pid, signal.SIGKILL)
                    break
                if temp_bytes > args.file_bytes:
                    disk_exceeded = True
                    os.killpg(proc.pid, signal.SIGKILL)
                    break
                time.sleep(0.01)
            proc.wait()
            stdout_size = os.fstat(stdout_file.fileno()).st_size
            stderr_size = os.fstat(stderr_file.fileno()).st_size
            output_exceeded = output_exceeded or stdout_size + stderr_size > args.output_bytes
            stdout_file.seek(0)
            stderr_file.seek(0)
            stdout = stdout_file.read(args.output_bytes)
            stderr = stderr_file.read(args.output_bytes)
    except Exception as error:  # only sanitized type/code is reported
        launch_error = getattr(error, 'errno', None) or type(error).__name__
        if proc and proc.poll() is None:
            os.killpg(proc.pid, signal.SIGKILL)
            proc.wait()

    elapsed_ms = (time.monotonic() - started) * 1000
    usage = resource.getrusage(resource.RUSAGE_CHILDREN)
    stdout_kept = stdout[:args.output_bytes]
    stderr_kept = stderr[:args.output_bytes]
    residue = []
    for root, dirs, files in os.walk(args.temp_root):
        residue.extend(os.path.relpath(os.path.join(root, name), args.temp_root)
                       for name in sorted(dirs + files))
    group_survived = False
    if proc:
        try:
            os.killpg(proc.pid, 0)
            group_survived = True
            os.killpg(proc.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        except PermissionError:
            group_survived = True
    cleanup_error = None
    try:
        shutil.rmtree(args.temp_root)
        os.mkdir(args.temp_root, mode=0o700)
    except Exception as error:
        cleanup_error = getattr(error, 'errno', None) or type(error).__name__
    residue_after_cleanup = []
    for root, dirs, files in os.walk(args.temp_root):
        residue_after_cleanup.extend(os.path.relpath(os.path.join(root, name), args.temp_root)
                                     for name in sorted(dirs + files))
    after_fds = fd_count()
    worker = None
    if not timed_out and not output_exceeded and launch_error is None and proc and proc.returncode == 0:
        try:
            worker = json.loads(stdout_kept.decode('utf-8'))
        except Exception:
            worker = None
    result = {
        'watchdogFormat': 'bounded-representation-watchdog-result-1',
        'returnCode': None if proc is None else proc.returncode,
        'timedOut': timed_out,
        'outputLimitExceeded': output_exceeded,
        'diskLimitExceeded': disk_exceeded,
        'launchError': launch_error,
        'stdoutBytes': locals().get('stdout_size', len(stdout)),
        'stderrBytes': locals().get('stderr_size', len(stderr)),
        'stdoutPrefixSha256Eligible': len(stdout_kept),
        'elapsedMilliseconds': round(elapsed_ms, 3),
        'cpuUserSeconds': round(usage.ru_utime - usage_before.ru_utime, 6),
        'cpuSystemSeconds': round(usage.ru_stime - usage_before.ru_stime, 6),
        'peakRssRaw': usage.ru_maxrss,
        'peakRssUnit': 'bytes' if sys.platform == 'darwin' else 'kibibytes',
        'peakTempBytes': peak_temp_bytes,
        'limitsEnforced': limits,
        'fdCountBefore': before_fds,
        'fdCountAfter': after_fds,
        'processGroupSurvived': group_survived,
        'tempResidueBeforeCleanup': residue,
        'tempResidueAfterCleanup': residue_after_cleanup,
        'cleanupError': cleanup_error,
        'runtime': {'python': platform.python_version(), 'os': platform.platform()},
        'worker': worker,
        'sanitizedStderrBytes': len(stderr_kept),
    }
    sys.stdout.write(json.dumps(result, sort_keys=True, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    main()
