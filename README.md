# session-peer skill

[한국어](README.ko.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

An agent skill for finding and messaging Claude Code, Codex, and live registered Antigravity sessions with [session-peer](https://github.com/abruption/session-peer), locally, over SSH, or through optional paired devices.

## Demo

![session-peer runtime exchanging messages between Claude Code and Codex](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

The runtime demonstration shows Claude Code and Codex messaging; the skill provides agent instructions.

## Quick Start

Requires session-peer 0.9.1 or newer; all documented features require session-peer 1.0.1 or newer. Paired-device transport is optional and needs `session-peer[relay]` on Unix with Python 3.11+.

### Install

Install the runtime and skill separately:

```bash
pipx install session-peer
session-peer --version
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
npx -y skills@latest list --global --json
```

The Skills CLI creates Claude Code and shared Codex/Antigravity copies. Open a new agent session if the skill catalog is cached.

### Update

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

The runtime command above is for pipx installations; keep using your existing runtime package manager. Runtime upgrades do not update the skill. See the usage guide for other installation methods and pinned versions.

Queued or submitted does not confirm consumption. Do not automatically resend after an uncertain submission; see the usage guide for Codex reply waiting.

The separate `session-peer-ts` skill supports the npm TypeScript runtime. See the [TypeScript setup guide](docs/typescript.md) for an explicit agent, project/global scope, and reviewed commit installation.

## Docs

- [TypeScript skill setup, pinned updates, and removal](docs/typescript.md)
- [Installation variants, pinned versions, compatibility, and reply waiting](docs/usage.md)
- [Published agent instructions](session-peer/SKILL.md)
- [Development and release procedure](CONTRIBUTING.md)
- [Runtime CLI reference](https://github.com/abruption/session-peer/blob/main/docs/cli-reference.md)

## License

[MIT](LICENSE)

## Support and security

For skill documentation and installation issues, [open an issue](https://github.com/abruption/session-peer-skill/issues/new). For CLI and transport issues, use the [runtime issue tracker](https://github.com/abruption/session-peer/issues).

Report vulnerabilities privately through the [maintainer’s security policy](https://github.com/abruption/session-peer/blob/main/SECURITY.md), including its email fallback. Do not post secrets, conversation text, or session identifiers in public issues.
