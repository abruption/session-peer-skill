# TypeScript skill compatibility proposal

[Back to TS setup](typescript.md)

**Draft for coordination with [TS issue #118](https://github.com/abruption/session-peer-ts/issues/118), 2026-10-07.** This document proposes a contract and rollout order. It does not implement a runtime compatibility change or approve a merge, pin change, installation, or release.

## Current published contract

The npm 0.3.2 publication source is [`f335f07352c842f2f6ceb12bd2ca6274b52f69f7`](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/RELEASING.md). Its [`inspectSkills`](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/src/diagnostics.ts) requires these exact values:

| Field | Published accepted value |
|---|---|
| `version` | `0.1.0` |
| `runtime-implementation` | `typescript` |
| `runtime-min-version` | `0.1.0` |
| `runtime-full-version` | `0.1.0` |
| `runtime-capability-policy` | `probe-help` |

The current repository tag `v0.3.2` and the previously reviewed skill commit `081cc3c1d16a394bd92824333f4bc61c36951799` contain the same TS skill bytes (SHA-256 `b0c323a54274be525c9862629b3ed3c4c3c6903821999e1b4b0f23585bc05634`). They satisfy this metadata contract. The repository tag is the Python skill release; it is not a TS skill or npm version.

The published check reads only named local entrypoints and frontmatter, with a 64 KiB limit. It does not run instructions, traverse references, fetch sources, install, or update. `compatible` with `verification: metadata_only` means the metadata tuple matched; it does not verify the installed content hash or approve a send. Unreadable or unparseable input can be `unknown`, a missing path is `missing`, and a parseable mismatch is `incompatible`. Every inspected path must be assessed independently.

## Proposed bounded successor

Keep the existing string-map schema and status envelope. Review a finite set of supported profiles instead of accepting arbitrary later versions, a wildcard, or every value greater than `0.1.0`.

| Profile | Skill version | Runtime minimum | Full documented runtime | Policy |
|---|---|---|---|---|
| Existing published profile | `0.1.0` | `0.1.0` | `0.1.0` historical baseline | `probe-help` |
| Candidate for discussion | `0.2.0` | `0.1.0` baseline commands | `0.3.2` published additions | `probe-help` |

Both profiles require `runtime-implementation: "typescript"`. The candidate numbers are proposals, not approved metadata or a released skill. The Draft instruction changes retain the old frontmatter to avoid unilaterally changing the contract during review; they must not be published as a new artifact under the old version.

For a successor, the minimum describes the supported command baseline and the full version describes all documented shipped features. On runtimes between the minimum and full version, the agent may use only commands supported by that exact runtime and affirmative help. Doctor must not label an unreviewed runtime/profile combination compatible. A separately reviewed TS 0.3.3 runtime could accept the legacy and successor tuples; public 0.3.2 would still reject the successor. No compatibility claim is made for unknown future versions.

The future checker should fail closed on a different implementation, unknown skill/profile/version, unsupported minimum/full values, missing required fields, conflicting or duplicate fields, malformed scalars/maps, and unreadable input. Malformed/ambiguous schema remains unknown; parseable unsupported profiles remain incompatible. A new schema or policy value needs explicit review. Inspection must remain metadata-only and must not invoke runtime executables, make network requests, read instruction bodies for execution, install/update anything, or authorize discovery/delivery. Source provenance and content review are separate from these structural results.

## Rollout order and gates

1. TS and skill owners review the proposed content, profile tuple, and bounded runtime support together. Coordinate the shared min/full meanings with the Python owner; Python skill metadata, flags, and release numbers remain independent.
2. With separate runtime implementation authorization, the TS owner prepares doctor support and tests in TS issue #118. Review legacy acceptance, the agreed successor, wrong implementation, unsupported min/full and runtime versions, missing/duplicate/conflicting fields, malformed metadata, and unknown future profiles. Tests must verify no body execution, installation, update, or network access by skill inspection.
3. Publish the compatible doctor runtime through its own approval process before distributing a successor skill as compatible with that runtime. Existing 0.3.2 behavior must be described accurately; do not promise that it accepts a new tuple.
4. With the contract agreed and separately authorized for publication, finalize the TS skill version/min/full values and validation expectations, review the resulting immutable skill-source commit, and update the TS repository's four-language guidance and PARITY pin together. Do not move existing tags or claim the current placeholder is an approved new pin.
5. Users who choose the successor update their runtime and skill separately with their existing managers. No postinstall, automatic deployment, PATH replacement, remote provisioning, or global skill update is implied.

This Draft can be reviewed and verified against published source without changing runtime code or user installations. It is not a substitute for the TS-side contract tests or a live consumption/ACK check.
