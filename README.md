# session-peer skill

[한국어](README.ko.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

An agent skill for finding and messaging Claude Code, Codex, and live registered Antigravity sessions with [session-peer](https://github.com/abruption/session-peer), locally or over SSH.

This repository contains instructions for agents. It does **not** install the `session-peer` runtime.

## Prerequisite

Install session-peer 0.9.1 or newer and verify it before installing the skill:

```bash
pipx install session-peer
session-peer --version
```

See the [session-peer installation options](https://github.com/abruption/session-peer#installation-options) for uv, pip, the POSIX standalone installer, and native Windows setup. Keep using the same package manager for upgrades.

## Install the skill

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

The Skills CLI installs copies for Claude Code and the shared agents directory used by Codex and Antigravity. Restart or open a new agent session if the current session does not refresh its skill catalog automatically.

Verify the installation:

```bash
npx -y skills@latest list --global --json
```

## Update

```bash
npx -y skills@latest update session-peer --global --yes
```

To reproduce the initial release exactly, install the `v0.1.0` tag:

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.1.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Source of truth

`session-peer/SKILL.md` in this repository is the published skill. The copy retained in the session-peer runtime repository is a transition compatibility snapshot. Runtime commands and transport behavior remain owned by the [session-peer repository](https://github.com/abruption/session-peer).

## Development

Validate discovery and a clean isolated installation before opening a pull request:

```bash
npx -y skills@latest add . --list
home="$(mktemp -d)"
HOME="$home" npx -y skills@latest add . \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
cmp session-peer/SKILL.md "$home/.agents/skills/session-peer/SKILL.md"
cmp session-peer/SKILL.md "$home/.claude/skills/session-peer/SKILL.md"
```

## License

MIT
