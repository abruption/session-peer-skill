# session-peer skill

[한국어](README.ko.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

An agent skill for finding and messaging Claude Code, Codex, and live registered Antigravity sessions with [session-peer](https://github.com/abruption/session-peer), locally, over SSH, or through optional paired devices.

This repository contains instructions for agents. It does **not** install the `session-peer` runtime.

## Prerequisite

Install session-peer 0.9.1 or newer and verify it before installing the skill:

```bash
pipx install session-peer
session-peer --version
```

See the [session-peer installation options](https://github.com/abruption/session-peer#installation-options) for uv, pip, the POSIX standalone installer, and native Windows setup. Keep using the same package manager for upgrades.

The skill documents basic commands shared by session-peer 0.9.1 and newer. `--allow-inactive-codex-home` and `--relay-login` require session-peer 1.0.0 or newer. macOS/Linux receiver policy `codexBin` and correlated Relay diagnostics require session-peer 1.0.1 or newer. The optional paired-device transport requires the `session-peer[relay]` extra (Unix, Python 3.11+).

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

To pin a release exactly, install its tag, for example `v0.3.1`:

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.1/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Version metadata

`session-peer/SKILL.md` records machine-readable versions in its frontmatter `metadata` map, as defined by the [Agent Skills specification](https://agentskills.io/specification):

| Key | Meaning |
|---|---|
| `version` | Skill release; matches the `vX.Y.Z` tag |
| `runtime-min-version` | Minimum session-peer runtime the skill supports |
| `runtime-full-version` | Runtime required for every option the skill documents |

Tools may read these values to report an outdated skill or runtime. Runtime 1.0.1 and newer can report an outdated skill through `skillUpdates` or an incompatible one through `session-peer doctor`. Use the skill's original installation manager to update it; runtime upgrades do not update independently managed skill files.

## Waiting for Codex replies

Codex receives messages through a queue and reads them only after its current turn ends. The skill therefore treats a missing reply from a busy Codex session as normal: it does not resend the request or ask again for a reply. When the next step depends on the reply, the agent records a correlation token and the step to resume from, pauses by ending its turn, and resumes once the matching reply arrives. A Codex sender receives that reply through its own queue, so continuing other work delays it.

## Source of truth

`session-peer/SKILL.md` in this repository is the published skill. The copy retained in the session-peer runtime repository is a transition compatibility snapshot. Runtime commands and transport behavior remain owned by the [session-peer repository](https://github.com/abruption/session-peer).

## Development

Validate the skill metadata, README consistency, discovery, and a clean isolated installation before opening a pull request. CI uses the Skills CLI version pinned in `.github/workflows/validate.yml`:

```bash
node scripts/validate-skill.mjs
npx -y skills@1.7.0 add . --list
home="$(mktemp -d)"
HOME="$home" npx -y skills@1.7.0 add . \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
cmp session-peer/SKILL.md "$home/.agents/skills/session-peer/SKILL.md"
cmp session-peer/SKILL.md "$home/.claude/skills/session-peer/SKILL.md"
```

## Releasing

1. Set `metadata.version` in `session-peer/SKILL.md` and the pinned tag in all four README files to the new version. Update `runtime-min-version`, `runtime-full-version`, and the matching sentences when runtime requirements change.
2. Run `node scripts/validate-skill.mjs` and merge the change.
3. Tag the merge commit with `git tag -a vX.Y.Z -m 'session-peer skill vX.Y.Z'`, push the tag, and publish the GitHub release. CI rejects a tag that differs from `metadata.version`.
4. Sync the runtime repository's compatibility snapshot: copy `session-peer/SKILL.md` to `skills/session-peer/SKILL.md` in [abruption/session-peer](https://github.com/abruption/session-peer), confirm the files are byte-identical with `cmp`, and open a pull request there.

## License

MIT
