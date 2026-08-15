#!/usr/bin/env python3
"""Send a follow-up to the pinned daily iPhone Cursor agent."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENT_FILE = ROOT / "memory" / "agent.json"
API = "https://api.cursor.com/v1/agents"


def load_agent() -> dict:
    return json.loads(AGENT_FILE.read_text())


def request(method: str, url: str, key: str, payload: dict | None = None) -> tuple[int, dict | str]:
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode()
        try:
            return exc.code, json.loads(raw)
        except json.JSONDecodeError:
            return exc.code, raw


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("text", nargs="?", help="Follow-up to send. Reads stdin if omitted.")
    parser.add_argument(
        "--create-if-missing",
        action="store_true",
        help="If the pinned agent is gone, create a replacement on this repo and update memory/agent.json",
    )
    args = parser.parse_args()

    key = os.environ.get("CURSOR_API_KEY", "").strip()
    if not key:
        print("Set CURSOR_API_KEY to a key from https://cursor.com/dashboard/api", file=sys.stderr)
        return 2

    text = args.text if args.text is not None else sys.stdin.read()
    text = text.strip()
    if not text:
        print("No text to send.", file=sys.stderr)
        return 2

    prompt = (
        text
        + "\n\nSave anything lasting in memory/ and commit it. I am talking from iPhone."
    )
    agent = load_agent()
    agent_id = agent["agentId"]
    status, body = request("POST", f"{API}/{agent_id}/runs", key, {"prompt": {"text": prompt}})

    if status == 409:
        print("Agent is busy. Wait a minute and send again.")
        print(body)
        return 1

    if status in {404, 410} and args.create_if_missing:
        status, body = request(
            "POST",
            API,
            key,
            {
                "name": "Iphone cursor agent",
                "prompt": {
                    "text": (
                        "You are Josh's daily iPhone Jarvis. Read AGENTS.md and memory/. "
                        "Update memory/agent.json with your id and URL. Then handle this:\n\n"
                        + text
                    )
                },
                "repos": [{"url": agent.get("repo", "https://github.com/joshuatmcauley/Jarvis")}],
            },
        )
        if status >= 400:
            print(f"Create failed ({status}): {body}", file=sys.stderr)
            return 1
        created = body.get("agent", body)
        agent["agentId"] = created["id"]
        agent["url"] = created.get("url", f"https://cursor.com/agents/{created['id']}")
        AGENT_FILE.write_text(json.dumps(agent, indent=2) + "\n")
        print(f"Pinned replacement agent {agent['agentId']}")
        print(agent["url"])
        return 0

    if status >= 400:
        print(f"Follow-up failed ({status}): {body}", file=sys.stderr)
        return 1

    print(f"Sent to {agent_id}")
    print(agent.get("url", f"https://cursor.com/agents/{agent_id}"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
