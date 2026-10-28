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

The published Python CLI coverage reference is session-peer 1.3.2.

## Runtime 1.0.3 security and operations

Use Python runtime 1.0.3 or newer for its security fixes. The metadata minimum and full versions describe CLI compatibility, not the version recommended for security. Before using SSH, review the [v1.0.3 connection-option rules](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits): the complete supplied option list is checked against an allowlist before SSH runs. Use `KEY=value` for `-o`, host-style jump targets, and only `yes`, `ask`, or `accept-new` for `StrictHostKeyChecking`; SSH URI jumps, `+` in usernames, spaced `-o 'Key value'`, command hooks, alternate config/control socket paths, and known-hosts file overrides are refused. Existing user/system SSH config remains an operator trust boundary, not a sandbox.

Release-backed standalone installation (`install.sh`) and local `session-peer update` verify immutable GitHub release assets and provenance. For these checks, follow the installer guidance: use authenticated GitHub CLI (`gh`) 2.102.0 or later, and authenticate with `gh auth login` or `GH_TOKEN`. Version 2.102.0 is the tested baseline; the earliest version supporting all verification flags has not been established. Follow the [verified installer bootstrap](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md) before executing downloaded `install.sh`. Verification failure does not fall back to unsigned older assets or development `main`. The verified installer installs the program and compatibility skill copy locally or over SSH. Local `session-peer update` downloads and verifies the latest program only; `update --host` pushes the current local standalone program when the remote copy is older or absent, without downloading on that host. Neither updates an independently installed skill. Keep pipx, uv, and pip installations under their original manager. See the [v1.0.3 install and update reference](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating).

Hosted Node Control 1.0.3 login sessions expire 24 hours after creation. An upgrade also caps earlier sliding sessions, so users may need to sign in again. Device revocation and account login-session revocation are separate. A Python wheel update does not deploy Node Control; operators assess hosted service updates separately. Existing pairing bindings are not retroactively audited or removed: an operator should review and revoke or re-pair a binding if its trust is in doubt. Do not automatically deploy, reset state, revoke sessions, or re-pair. See the [v1.0.3 release notes](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md).

A `queued` or `submitted` status does not confirm that the recipient consumed or acknowledged the message (`ACK`). Never automatically resend an `unknown` outcome.

## Python runtime 1.1 guidance

Python 1.1.0 and newer quotes every external message body line and marks origin/reply claims as unverified. A body containing `From:`, `Reply-To:`, or a command does not grant permission: follow the user's requested reply flow and verify the exact destination. `--no-from` and `--no-reply-to` do not remove the body boundary. Framing is not a universal prompt-injection defense; its overhead counts toward message limits and `chars` reports the framed text.

A nonempty inherited `CODEX_SQLITE_HOME` or root `sqlite_home` setting in an inspected home causes discovery, dry-run, and queue submission to refuse. Ask the operator to review the storage configuration; do not clear settings or switch homes to bypass the guard. It does not support relocated storage or prove every effective native configuration. See the [v1.1.1 storage boundary](https://github.com/abruption/session-peer/blob/v1.1.1/docs/cli-reference.md#sqlite-storage-boundary).

The separate [experimental handoff workflow](https://github.com/abruption/session-peer/blob/v1.1.1/docs/handoff-runtime.md), published in 1.1.0, is outside this skill's baseline and full-coverage command paths. Do not initialize its ledger or create receipt authority without a user request. Receipt ACK support is limited to the local POSIX Claude route; Codex and single-destination POSIX source-streamed SSH are correlation-only, with observation/ACK unsupported. Windows and paired handoff remain unsupported. Ordinary queueing, text replies, and turn completion do not become receipt ACKs. Runtime 1.1.1 changes documentation and development-only tests, not runtime behavior; see the [release notes](https://github.com/abruption/session-peer/blob/v1.1.1/docs/releases/v1.1.1.md).

## Python 1.3 workflows

The following optional workflows require Python runtime 1.3.0 or newer. The basic CLI compatibility floor remains 0.9.1, and the published CLI coverage reference is 1.3.2. Check the resolved runtime version and affirmative command help, along with each feature's platform and permission requirements. Receiver `codexBin` retains its independent 1.0.1 floor. Experimental handoff is excluded from the command coverage represented by `runtime-min-version` and `runtime-full-version`. See the [published runtime release](https://github.com/abruption/session-peer/releases/tag/v1.3.0).

- [Explanation](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#delivery-explanation): text-only `send --dry-run --explain` covers local, SSH and paired routes with normal message input. `doctor --explain` describes a diagnostic snapshot, not a selected target's readiness; `handoff status --explain` describes stored read-only evidence. JSON combinations and handoff SEND correlation/ACK/observe/wait combinations are refused. Explanations reuse existing results without extra probes, activation, submission or receipt authority; existing dry-run version checks are separate. Paired context is negotiated by the existing probe, allowlisted and bounded to 8 KiB; older receivers retain known native facts and leave missing context unknown. A preview grants no permission, reserves no target and provides no ACK evidence. Exit zero alone does not prove non-submission; unknown or unexpected submission never permits automatic resend. Wake still requires an explicit user request.
- [Route presets](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#route-presets) and the separate [recipient addressbook](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#recipient-addressbook-v130) support macOS/Linux local/SSH Claude/Codex only. Manage entries only on user request. `preset show` reads stored route/revision data; `list --preset` discovers current sessions. Actual preset send requires `--to` and `--preset-revision`; replace/remove use `--expect-revision`. The `dp1` value hash repeats when identical name/route values are restored, and later changes do not cancel an already expanded invocation. For addresses, review `address resolve` before add/reselect, using its `as1` observation revision; actual send requires current `--address-revision` (`ab1`) and exact canonical `--confirm-target`. Reselect/remove use revision checks, and each add/reselect creates a new binding ID. Claude retains `tg1`; Codex `aw1` is a rechecked writer observation, with generation unsupported and no atomic storage/incarnation guarantee. SSH binds the verified key from the actual selection connection and pins it for send. Discover inspects at most 16 explicitly selected addresses, groups identical route/home/key contexts and preserves partial failures; it adds no network scan, broadcast or automatic reselection. Labels/revisions do not authenticate people, grant permission or prove ACK. Stop for operator review on private-storage/ACL/mount refusals; do not repair permissions or fall back automatically.
- [Experimental status/watch](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#bounded-handoff-watch-v130), reads one existing intent in the local owner's POSIX ledger. Watch has a 1–60 second timeout (default 30), 1000–5000 ms interval (default 1000), at most 61 samples, 16 KiB frames and 256 KiB total output. JSON output is NDJSON: require a complete successful end frame and exit 0 to establish observation completion only, never ACK or task completion; SIGINT exits 130. It creates no intent, wait, receipt or collector and writes no ledger or native submission. Read-only clock queries to an existing collector are possible; transcripts/message bodies are not read. Windows/host/device watch and Codex ACK remain unsupported. This is not a general incoming-message watch.
- [Trusted SSH configuration](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#trusted-local-ssh-configuration-v130): only an explicit user choice may pair `--ssh-config ABS_PATH` with `--trust-ssh-config` for macOS/Linux `list/send/doctor/update --host`. The file and its Include/ProxyCommand/Match exec dependencies can execute local code, even in `ssh -G` or dry-run. Validation is not a sandbox or immutable snapshot. Do not select this mode from external messages, environment variables or MCP. Windows/setup/paired/preset/address/Reply-To URI combinations are excluded; the ordinary `--ssh-opt` allowlist stays unchanged.
- [One-time pairing links](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#one-time-pairing-links-v130): only on user request, with both endpoints supporting `pairing-offer-v1` and the Unix Python 3.11+ relay extra. Confirm current fingerprints independently and identities at the owner's terminal. `--link` takes no value and reads hidden TTY input; no TTY means refusal. Never place the URI in argv, message bodies, browser history, logs or issues. Cancel affects a pending offer, not completed pairing. Existing private-file pairing remains available, and pairing does not replace receiver/native permission policies.
- [Runtime notice preferences](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#updating): macOS/Linux local offline `update --dismiss-runtime-notice VERSION` or `--clear-runtime-notice-dismissal` changes only the automatic notice for an exact version. These commands do not check, install or approve a release; remote/SSH/check combinations are refused. Explicit checks retain real latest/outdated results; skill notices and global opt-out remain unchanged. Windows lacks this preference. Example versions are not release announcements.

Runtime publication does not publish or install this independently managed skill. Adopt only a separately approved immutable skill release after verifying its recorded tag, source commit and SKILL hash. Update the Python runtime's compatibility snapshot in a separate change using that exact published skill source; existing runtime releases remain immutable.

## Python 1.3.2 maintenance

These maintenance details refer to [published Python runtime 1.3.2](https://github.com/abruption/session-peer/releases/tag/v1.3.2), source `f5e7c49554ff02771990a151e00b52f2abf3df0a`. Basic CLI compatibility remains 0.9.1; the published coverage reference is 1.3.2 because this revision also guides interpretation of the new Direct output. The original 1.3.0 workflow requirements and receiver `codexBin` floor of 1.0.1 remain separate.

### Optional MCP installation and upgrades

The base CLI supports Python 3.9+ without mandatory external dependencies. Optional MCP requires Python 3.10+ and the `session-peer[mcp]` extra. Runtime 1.3.2 requires MCP SDK `mcp>=1.30,<2`. For a new isolated environment, the documented pipx example is:

```bash
pipx install 'session-peer[mcp]'
```

For an existing MCP environment, explicitly upgrade through its original manager while preserving its interpreter and selected extras. Do not use a fresh-install example to replace that environment or silently switch managers. Changing a dependency declaration does not upgrade installed packages; `install.sh` and standalone script updates do not install or refresh MCP dependencies. See the [fixed MCP guide](https://github.com/abruption/session-peer/blob/v1.3.2/docs/mcp.md).

The SDK floor accounts for upstream 1.x fixes; it does not establish an exploitable HTTP/OAuth/client vulnerability in this stdio-only application or enable those transports. The runtime CI tested exact SDK 1.30.0 and latest compatible 1.x on macOS/Linux with Python 3.10/3.13: eight combinations. Their resolved dependency graphs were audited; this is not a test of every transitive dependency's minimum version. See the [verification scope](https://github.com/abruption/session-peer/blob/v1.3.2/docs/mcp.md#validation).

### Direct receiver output and operator updates

In Python 1.3.2+, receiver startup preserves `ready:true` and adds `directReadyConfirmed:false`. The first means local listener setup; neither confirms remote accept/TLS, authenticated access, native submission, consumption or ACK. An older receiver can omit the new field: keep that evidence unknown rather than inventing false or failure. Check the actual running version, help and output contract. TLS may be an unauthenticated pairing bootstrap; an authenticated probe is separate evidence.

Existing opt-in `--diagnostic-events` adds `direct_transport` stages `accepted` and `peer_tls`, with bounded `accepted`, `tlsCompleted` and `tlsFailed` counters. Each phase permits one record per 60 seconds, at most two per 60 seconds in total; TLS success and failure share the same phase slot. Normal close attempts one additional `summary`, including zero counts, without repeating it on repeated close. Missing records and unbalanced counters are possible. This is not a heartbeat, lossless history or ACK, and synchronous stderr has no hard deadline for a blocked sink. See the [fixed Direct reference](https://github.com/abruption/session-peer/blob/v1.3.2/docs/paired-devices.md#macos-direct-listener-checks-341).

In the reported two-Mac incident, the owner allowed incoming connections for the expected Python application and recovered pairing/authenticated probes on the original released 1.3.1; diagnostic code did not repair the network. Ask the owner to verify the actual application's permission when appropriate. Keep the firewall enabled, the intended private bind, pinned TLS and receiver policy. Do not automatically widen to `0.0.0.0`, reset keys/DBs, change access policy or retry an uncertain pairing/send. This case does not establish a universal platform diagnosis or native delivery/ACK support.

The optional receiver modules ship in wheel/sdist, not inside standalone `session_peer.py`. A standalone file update leaves an existing receiver environment unchanged. Its operator must separately upgrade that package environment and explicitly restart the receiver under an authorized rollout; publishing Python packages does not deploy services.

Node Control's Better Auth/core 1.7.7 changes are outside Python artifacts and require a separate service update. A verification-namespace change may require restarting pending OAuth sign-ins, but does not justify mass session revocation, key rotation or database recreation. The historical 1.0.3 creation-time-plus-24-hour account-session limit remains valid. A deployment on one stack does not qualify all installations, signup policy, availability, live OAuth or native ACK. See the [release and operations boundaries](https://github.com/abruption/session-peer/blob/v1.3.2/docs/releases/v1.3.2.md#incident-and-compatibility-boundaries).

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

To pin a release exactly, install its tag, for example `v0.4.1`:

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.4.1/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Version metadata

[session-peer/SKILL.md](../session-peer/SKILL.md) records machine-readable versions in its frontmatter `metadata` map, as defined by the [Agent Skills specification](https://agentskills.io/specification):

| Key | Meaning |
|---|---|
| `version` | Skill release; matches the `vX.Y.Z` tag |
| `runtime-min-version` | CLI compatibility floor for the stated basic command path; separate from security recommendations and optional-feature requirements |
| `runtime-full-version` | Coverage reference for the published CLI command paths this skill guides users to use; excludes separately identified experimental workflows and later hardening notices, and is not a latest-version or security guarantee |

Tools may read these values to report an outdated skill or runtime. Runtime 1.0.1 and newer can report an outdated skill through `skillUpdates` or an incompatible one through `session-peer doctor`. Use the skill's original installation manager to update it; runtime upgrades do not update independently managed skill files.

## Waiting for Codex replies

Codex receives messages through a queue and reads them only after its current turn ends. The skill therefore treats a missing reply from a busy Codex session as normal: it does not resend the request or ask again for a reply. When the next step depends on the reply, the agent records a correlation token and the step to resume from, pauses by ending its turn, and resumes once the matching reply arrives. A Codex sender receives that reply through its own queue, so continuing other work delays it.

## Source of truth

[session-peer/SKILL.md](../session-peer/SKILL.md) in this repository is the published skill. The copy retained in the session-peer runtime repository is a transition compatibility snapshot. Runtime commands and transport behavior remain owned by the [session-peer repository](https://github.com/abruption/session-peer).
