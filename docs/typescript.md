# TypeScript runtime skill

[Back to README](../README.md)

The separate `session-peer-ts` skill describes the published npm TypeScript runtime 0.3.2, whose reviewed publication source is [`f335f07352c842f2f6ceb12bd2ca6274b52f69f7`](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/RELEASING.md). The runtime runs without Python. Both runtimes use the command name `session-peer`, so select the intended executable and inspect its version and help before use.

## Published support and independent versions

Published 0.2.0 added combined listing, bounded known Codex homes, guarded live-writer selection, explicit inactive queueing, read-only doctor, and explicit text output. Published 0.3.0 added multi-host SSH, constrained SSH options and a POSIX jump option, Tailscale routing hints, generated reply routes, opt-in return-route diagnostics, npm update checks and cached notices, and the optional shell `sp` alias. These are shipped capabilities present in 0.3.2, not development-only features. Always check the selected executable's actual version and supported command help. Wake, Antigravity, Relay, MCP, general wait, and Draft 0.4 handoff/observer designs remain unsupported.

| Version | Meaning |
|---|---|
| Repository tag `v0.3.2` | Python skill release workflow; includes a separate TS skill file |
| Python skill `0.3.2` | Version of `session-peer/SKILL.md` |
| TS skill `0.1.0` | Current frontmatter version of `session-peer-ts/SKILL.md` |
| TS runtime `0.3.2` | Published npm package; independent of both skill versions |
| TS runtime min/full `0.1.0` | Current historical baseline contract with `probe-help`; newer operations require the published feature version and supported help |

The minimum describes CLI compatibility for the stated implementation's baseline; the full value is this skill revision's published-feature coverage reference. Neither is a security recommendation or latest-version marker, nor does either replace feature checks and separate doctor acceptance or prove delivery/ACK. Help establishes option presence only; platform/native prerequisites, permissions, allowlists, and writer guards still apply. See the [normative min/full definitions and separate doctor acceptance table](typescript-compatibility.md#minimum-full-features-and-guard-acceptance).

This Draft refresh retains the existing TS metadata while the successor contract is reviewed. Public runtime 0.3.2 doctor accepts only the exact current metadata profile; a successor tuple is `incompatible`. Keep the supported published skill or, after separate approval and publication, choose the reviewed guard runtime before its successor skill. Do not edit metadata to hide a mismatch. A compatible metadata check is not a content review, source authentication, freshness check, or delivery authorization; unchanged Draft frontmatter does not establish current doctor compatibility of the changed instructions. The [compatibility and rollout proposal](typescript-compatibility.md) must be settled before final versioning or repinning this candidate. Python's canonical skill, compatibility snapshot, published runtime, and existing parity/reference pins remain intact.

## Install, update, and remove the skill

Choose a reviewed **40-character commit SHA**, agent (`codex` or `claude-code`),
and scope explicitly. Run in the intended project; omitting `--global` selects
project scope. Inspect existing files before accepting an overwrite. For global
scope add `--global` consistently to add/list/remove. Codex uses the shared
`.agents/skills` directory, so agent selection is not an isolation boundary from
other clients that discover that directory.

```sh
npx -y skills@1.7.0 add https://github.com/abruption/session-peer-skill/tree/REVIEWED_COMMIT/session-peer-ts \
  --skill session-peer-ts --agent codex --copy --yes
npx -y skills@1.7.0 list --agent codex --json
npx -y skills@1.7.0 remove session-peer-ts --agent codex --yes
```

Replace `REVIEWED_COMMIT` before running. To update, review another exact commit
and repeat `add` with the same scope/agent; `update` follows a moving source and
is not the pinned update workflow. Review your installed copy for local edits
first. Installation choices never authorize sending a message or modifying
runtime/service configuration. Restart the agent if its catalog is cached.

PR #14 was merged and the separate TS skill is included in repository `v0.3.2`. Its current metadata remains `runtime-implementation: "typescript"` and `runtime-capability-policy: "probe-help"`, with independent skill version `0.1.0`. The `vX.Y.Z` tag workflow belongs to the Python skill; it does not set the TS skill's version or publish the npm runtime.

## Runtime checks and ownership

Resolve the executable before discovery. Explicit JSON remains a safe baseline; operations have no default output format. See the [agent instructions](../session-peer-ts/SKILL.md) for current discovery, dry-run, SSH, and reply boundaries, and the [reviewed CLI help](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/src/help.ts) for supported flags.

`doctor --json` performs read-only diagnostics; `ok:true` can coexist with `ready:false`. Published skill inspection uses a 64 KiB pre-read size check and interprets only entrypoint frontmatter; `metadata_only` does not mean body bytes are unread, and the check does not establish an enforced read-time byte budget or descriptor identity guarantee. It never executes instructions, installs, updates, or makes a network request. See the [current status table and future contract proposal](typescript-compatibility.md); permission errors remain distinct from unknown input. Future bounded-reader acceptance is part of TS issue #118's separate guard review. `doctor --check-return-route` is a separate, explicitly requested SSH probe. Metadata compatibility and forward SSH reachability do not prove that a send is authorized or that a return route works.

`update --check --json` reads the npm registry without installing anything. Keep upgrades under the original manager; the CLI refuses self-update without `--check`. Cached notices require the user's opt-in `SESSION_PEER_UPDATE_NOTICE=1`. The optional `sp` is a sourced shell alias, not an automatically installed global binary. Runtime checks and upgrades do not change separately managed skills, Python installations, or remote hosts. A queued or posted message is not consumption or ACK; never automatically resend an unknown outcome.
