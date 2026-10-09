# Usage and compatibility

[Back to README](../README.md)

## Prerequisite

Before installing the skill, make sure session-peer 0.9.1 or newer is installed and check its version. The example below uses pipx; if the runtime is already installed, skip the install command and run only the version check:

```bash
pipx install session-peer
session-peer --version
```

See the [session-peer installation options](https://github.com/abruption/session-peer#installation-options) for uv, pip, the POSIX standalone installer, and native Windows setup. Keep using the same package manager for upgrades.

The skill documents basic commands shared by session-peer 0.9.1 and newer. `--allow-inactive-codex-home` and `--relay-login` require session-peer 1.0.0 or newer. macOS/Linux receiver policy `codexBin` and Relay diagnostics correlated by `attemptId` require session-peer 1.0.1 or newer. The optional paired-device transport requires the `session-peer[relay]` extra (Unix, Python 3.11+).

## Runtime 1.0.3 security and operations

Use Python runtime 1.0.3 or newer for its security fixes. The metadata minimum and full versions describe CLI compatibility, not the version recommended for security. Before using SSH, review the [v1.0.3 connection-option rules](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits): the complete supplied option list is checked against an allowlist before SSH runs. Use `KEY=value` for `-o`, host-style jump targets, and only `yes`, `ask`, or `accept-new` for `StrictHostKeyChecking`; SSH URI jumps, `+` in usernames, spaced `-o 'Key value'`, command hooks, alternate config/control socket paths, and known-hosts file overrides are refused. Existing user/system SSH config remains an operator trust boundary, not a sandbox.

Release-backed standalone installation (`install.sh`) and local `session-peer update` verify immutable GitHub release assets and provenance. For these checks, follow the installer guidance: use authenticated GitHub CLI (`gh`) 2.102.0 or later, and authenticate with `gh auth login` or `GH_TOKEN`. Version 2.102.0 is the tested baseline; the earliest version supporting all verification flags has not been established. Follow the [verified installer bootstrap](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md) before executing downloaded `install.sh`. Verification failure does not fall back to unsigned older assets or development `main`. The verified installer installs the program and compatibility skill copy locally or over SSH. Local `session-peer update` downloads and verifies the latest program only; `update --host` pushes the current local standalone program when the remote copy is older or absent, without downloading on that host. Neither updates an independently installed skill. Keep pipx, uv, and pip installations under their original manager. See the [v1.0.3 install and update reference](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating).

Hosted Node Control 1.0.3 login sessions expire 24 hours after creation. An upgrade also caps earlier sliding sessions, so users may need to sign in again. Device revocation and account login-session revocation are separate. A Python wheel update does not deploy Node Control; operators assess hosted service updates separately. Existing pairing bindings are not retroactively audited or removed: an operator should review and revoke or re-pair a binding if its trust is in doubt. Do not automatically deploy, reset state, revoke sessions, or re-pair. See the [v1.0.3 release notes](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md).

A `queued` or `submitted` status does not confirm that the recipient consumed or acknowledged the message (`ACK`). Never automatically resend an `unknown` outcome.

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

To pin a release exactly, install its tag, for example `v0.3.3`:

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.3/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Version metadata

[session-peer/SKILL.md](../session-peer/SKILL.md) records machine-readable versions in its frontmatter `metadata` map, as defined by the [Agent Skills specification](https://agentskills.io/specification):

| Key | Meaning |
|---|---|
| `version` | Skill release; matches the `vX.Y.Z` tag |
| `runtime-min-version` | Minimum session-peer runtime the skill supports |
| `runtime-full-version` | Runtime required for every option the skill documents |

Tools may read these values to report an outdated skill or runtime. Runtime 1.0.1 and newer can report an outdated skill through `skillUpdates` or an incompatible one through `session-peer doctor`. Use the skill's original installation manager to update it; runtime upgrades do not update independently managed skill files.

## Waiting for Codex replies

Codex receives messages through a queue and reads them only after its current turn ends. The skill therefore treats a missing reply from a busy Codex session as normal: it does not resend the request or ask again for a reply. When the next step depends on the reply, the agent records a correlation token and the step to resume from, pauses by ending its turn, and resumes once the matching reply arrives. A Codex sender receives that reply through its own queue, so continuing other work delays it.

## Source of truth

[session-peer/SKILL.md](../session-peer/SKILL.md) in this repository is the published skill. The copy retained in the session-peer runtime repository is a transition compatibility snapshot. Runtime commands and transport behavior remain owned by the [session-peer repository](https://github.com/abruption/session-peer).
