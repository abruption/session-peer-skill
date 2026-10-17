# TypeScript runtime skill

[Back to README](../README.md)

The `session-peer-ts` skill documents the npm TypeScript runtime, which runs without Python. Both runtimes use the command name `session-peer`: resolve the intended executable and inspect its version/help before use.

Runtime [0.4.0](https://github.com/abruption/session-peer-ts/releases/tag/v0.4.0) is published from source [`dde3923efe116f87f38b1639b29b889d2b832e44`](https://github.com/abruption/session-peer-ts/tree/dde3923efe116f87f38b1639b29b889d2b832e44). It adds the explicitly authorized, limited [handoff workflow](typescript-handoff.md): private POSIX correlation/intent records, bounded local or POSIX SSH observation/wait, and explicit operator confirmation. Native client-ID observation is qualified only for exact Codex 0.160.1/0.162.1 on macOS arm64 under the stated storage/writer conditions. Queueing, injection, completed turns and arbitrary replies are not automatic receipt ACK. Linux native observation, Windows handoff/private ACLs and automatic receipt bootstrap remain unsupported.

## Runtime support and independent versions

Runtime 0.2.0 added combined listing, bounded known Codex homes, guarded live-writer selection, explicit inactive queueing, read-only doctor and text output. Runtime 0.3.0 added multi-host SSH, constrained SSH options/POSIX jump, Tailscale hints, generated reply routes, opt-in return-route diagnostics, npm update checks/notices and the optional shell `sp` alias. Runtime 0.4.0's bounded handoff path does not enable general-purpose wait, wake, Antigravity, Relay, MCP, Side Session or steering. Select features using affirmative help and their actual platform/native/permission guards.

| Version | Meaning |
|---|---|
| Python skill/tag `0.3.3` / `v0.3.3` | Independently managed Python skill; unchanged by TS releases |
| TS skill `0.3.0` | Version declared by `session-peer-ts/SKILL.md`; metadata is not publication evidence |
| TS revision tag `session-peer-ts-v0.3.0` | Select only after verifying its approved release, peeled source commit and canonical content hash |
| TS runtime `0.4.0` | Published npm package `session-peer`; does not publish or install this skill |
| `runtime-min-version` = `0.1.0` | CLI compatibility floor for the explicitly documented ordinary baseline |
| `runtime-full-version` = `0.4.0` | Feature coverage reference; not a security/latest marker or universal platform guarantee |
| Skill doctor acceptance | Public runtime `0.4.0` explicitly accepts skill `0.3.0`; public `0.3.2`–`0.3.6` reject that profile |

Minimum/full and doctor acceptance are separate contracts. A numerically sufficient runtime may reject a newer profile. Help proves option presence only; permissions, native/platform prerequisites, allowlists, storage and writer guards still apply. See the [finite support matrix and normative definitions](typescript-compatibility.md#minimum-full-features-and-guard-acceptance). Do not change metadata to hide a mismatch or infer support for future versions. A compatible metadata check is not content authentication, permission to send, consumption or ACK.

## Install, update, and remove the skill

Choose the skill version, agent (`codex` or `claude-code`), and scope explicitly. Find the selected TS tag in the [skill release catalog](https://github.com/abruption/session-peer-skill/releases) and verify its approved publication, recorded peeled tag commit, and canonical TS `SKILL.md` SHA-256. For this revision, the tag name is `session-peer-ts-v0.3.0`; if its publication or source/hash record cannot be verified, stop rather than using a Draft/PR head or a guessed future pin. Replace `REVIEWED_COMMIT` below with that verified **40-character commit SHA**, and compare the copied skill bytes to the release hash. Run in the intended project; omitting `--global` selects project scope. Inspect existing files before accepting an overwrite. For global scope add `--global` consistently to add/list/remove. Codex uses the shared `.agents/skills` directory, so agent selection is not an isolation boundary from other clients that discover that directory.

```sh
npx -y skills@1.7.0 add https://github.com/abruption/session-peer-skill/tree/REVIEWED_COMMIT/session-peer-ts \
  --skill session-peer-ts --agent codex --copy --yes
npx -y skills@1.7.0 list --agent codex --json
npx -y skills@1.7.0 remove session-peer-ts --agent codex --yes
```

Replace `REVIEWED_COMMIT` before running. To update, review another exact commit and repeat `add` with the same scope/agent; `update` follows a moving source and is not the pinned update workflow. Review your installed copy for local edits first. Installation choices never authorize sending a message or modifying runtime/service configuration. Restart the agent if its catalog is cached.

The TS metadata uses `runtime-implementation: "typescript"` and `runtime-capability-policy: "probe-help"`. Python `vX.Y.Z` tags and TS `session-peer-ts-vX.Y.Z` tags follow separate release procedures; neither publishes the npm runtime. See [Contributing](../CONTRIBUTING.md#typescript-skill-releases).

## Runtime checks and ownership

Resolve the executable before discovery. Explicit JSON remains a safe baseline; operations have no default output format. See the [agent instructions](../session-peer-ts/SKILL.md) for discovery, dry-run, SSH, and reply boundaries, and the [published CLI help](https://github.com/abruption/session-peer-ts/blob/dde3923efe116f87f38b1639b29b889d2b832e44/src/help.ts) for supported flags.

`doctor --json` performs read-only diagnostics; `ok:true` can coexist with `ready:false`. Skill inspection in the reviewed public runtimes 0.3.3–0.3.6 and 0.4.0 bounds whole-file UTF-8 reads to 65,536 bytes, with at most 65,537 bytes for overflow detection, and checks regular-file, descriptor/path, and observable stability evidence. It reads body bytes but interprets only frontmatter; `metadata_only` does not execute instructions, install, update, or make network requests. It does not authenticate content, freeze an atomic snapshot, or impose a deadline on arbitrary filesystem I/O. Public 0.3.2 had only a 64 KiB pre-read size check. See the [published compatibility contract and status table](typescript-compatibility.md); permission errors remain distinct from unknown input.

`doctor --check-return-route` is a separate, explicitly requested SSH probe. Metadata compatibility and forward SSH reachability do not prove that a send is authorized or that a return route works.

`update --check --json` reads the npm registry without installing anything. Keep upgrades under the original manager; the CLI refuses self-update without `--check`. Cached notices require the user's opt-in `SESSION_PEER_UPDATE_NOTICE=1`. The optional `sp` is a sourced shell alias, not an automatically installed global binary. Runtime checks and upgrades do not change separately managed skills, Python installations, or remote hosts. A queued or posted message is not consumption or ACK; never automatically resend an unknown outcome.

## Windows SSH results in runtime 0.3.4

[Runtime 0.3.4](https://github.com/abruption/session-peer-ts/releases/tag/v0.3.4) forwards the native exit code from Windows PowerShell SSH version preflight and request execution; a missing native exit code fails with exit 1. Complete validated submission evidence is retained after an abnormal transport exit. Partial or malformed output remains uncertain, so inspect the structured submission result and never automatically resend. Neither submission evidence nor a successful exit establishes consumption or ACK.

Coordinate any requested runtime upgrade through the existing package manager on each endpoint: SSH still requires the same exact TS runtime version at both ends. The upgrade does not update the companion skill or provision remote runtimes automatically. This guidance reflects published source and release evidence; it does not claim a new live-agent delivery or ACK test.
