# TypeScript runtime skill

[Back to README](../README.md)

The separate `session-peer-ts` skill 0.2.0 describes the published npm TypeScript runtime 0.3.3. Its publication source is [`c0ed30273b9e9c0049df86ae3c38486a94289527`](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/RELEASING.md). The runtime runs without Python. Both runtimes use the command name `session-peer`, so resolve the intended executable and inspect its version and help before use.

## Published support and independent versions

Published 0.2.0 added combined listing, bounded known Codex homes, guarded live-writer selection, explicit inactive queueing, read-only doctor, and explicit text output. Published 0.3.0 added multi-host SSH, constrained SSH options and a POSIX jump option, Tailscale routing hints, generated reply routes, opt-in return-route diagnostics, npm update checks and cached notices, and the optional shell `sp` alias. Runtime 0.3.3 adds the bounded metadata reader and supports this skill's successor profile. Always check the selected executable's actual version and supported command help. Wake, Antigravity, Relay, MCP, general wait, and Draft 0.4 handoff/observer designs remain unsupported.

| Version | Meaning |
|---|---|
| Python repository tag `v0.3.2` | Independent Python skill release |
| Python skill `0.3.2` | Version of `session-peer/SKILL.md` |
| TS skill `0.2.0` | Version of `session-peer-ts/SKILL.md` |
| TS skill tag `session-peer-ts-v0.2.0` | Separate TS skill release; resolve its annotated tag to the exact commit recorded in the release |
| TS runtime `0.3.3` | Published npm package `session-peer`; independent of both skill versions |
| `runtime-min-version` = `0.1.0` | CLI compatibility floor for the explicit baseline commands |
| `runtime-full-version` = `0.3.2` | Coverage reference for this revision's published CLI features |
| Successor doctor acceptance | Runtime `0.3.3` accepts this exact metadata profile; public `0.3.2` rejects it |

The minimum and full values are distinct from security recommendations, latest-version markers, doctor support, and delivery/ACK. Help establishes option presence only; platform/native prerequisites, permissions, allowlists, and writer guards still apply. See the [normative min/full definitions and separate doctor acceptance table](typescript-compatibility.md#minimum-full-features-and-guard-acceptance).

Use runtime 0.3.3 for reviewed doctor metadata compatibility with TS skill 0.2.0. Public 0.3.2 rejects the successor even though it meets the baseline CLI minimum and feature coverage values. Keep the existing package manager and obtain authorization before upgrading; do not edit metadata to hide a mismatch. Unknown future runtime/profile combinations are not automatically accepted. A compatible metadata check is not a content review, source authentication, freshness check, or delivery authorization.

## Install, update, and remove the skill

Choose the reviewed **40-character commit SHA** from the [TS skill release](https://github.com/abruption/session-peer-skill/releases/tag/session-peer-ts-v0.2.0), agent (`codex` or `claude-code`), and scope explicitly. The release records the peeled tag commit and SHA-256 of the canonical TS `SKILL.md`. Run in the intended project; omitting `--global` selects project scope. Inspect existing files before accepting an overwrite. For global scope add `--global` consistently to add/list/remove. Codex uses the shared `.agents/skills` directory, so agent selection is not an isolation boundary from other clients that discover that directory.

```sh
npx -y skills@1.7.0 add https://github.com/abruption/session-peer-skill/tree/REVIEWED_COMMIT/session-peer-ts \
  --skill session-peer-ts --agent codex --copy --yes
npx -y skills@1.7.0 list --agent codex --json
npx -y skills@1.7.0 remove session-peer-ts --agent codex --yes
```

Replace `REVIEWED_COMMIT` before running. To update, review another exact commit and repeat `add` with the same scope/agent; `update` follows a moving source and is not the pinned update workflow. Review your installed copy for local edits first. Installation choices never authorize sending a message or modifying runtime/service configuration. Restart the agent if its catalog is cached.

The TS metadata uses `runtime-implementation: "typescript"` and `runtime-capability-policy: "probe-help"`. Python `vX.Y.Z` tags and TS `session-peer-ts-vX.Y.Z` tags follow separate release procedures; neither publishes the npm runtime. See [Contributing](../CONTRIBUTING.md#typescript-skill-releases).

## Runtime checks and ownership

Resolve the executable before discovery. Explicit JSON remains a safe baseline; operations have no default output format. See the [agent instructions](../session-peer-ts/SKILL.md) for discovery, dry-run, SSH, and reply boundaries, and the [published CLI help](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/src/help.ts) for supported flags.

`doctor --json` performs read-only diagnostics; `ok:true` can coexist with `ready:false`. Runtime 0.3.3 skill inspection bounds whole-file UTF-8 reads to 65,536 bytes, with at most 65,537 bytes for overflow detection, and checks regular-file, descriptor/path, and observable stability evidence. It reads body bytes but interprets only frontmatter; `metadata_only` does not execute instructions, install, update, or make network requests. It does not authenticate content, freeze an atomic snapshot, or impose a deadline on arbitrary filesystem I/O. Public 0.3.2 had only a 64 KiB pre-read size check. See the [published compatibility contract and status table](typescript-compatibility.md); permission errors remain distinct from unknown input.

`doctor --check-return-route` is a separate, explicitly requested SSH probe. Metadata compatibility and forward SSH reachability do not prove that a send is authorized or that a return route works.

`update --check --json` reads the npm registry without installing anything. Keep upgrades under the original manager; the CLI refuses self-update without `--check`. Cached notices require the user's opt-in `SESSION_PEER_UPDATE_NOTICE=1`. The optional `sp` is a sourced shell alias, not an automatically installed global binary. Runtime checks and upgrades do not change separately managed skills, Python installations, or remote hosts. A queued or posted message is not consumption or ACK; never automatically resend an unknown outcome.
