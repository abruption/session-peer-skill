# TypeScript skill compatibility proposal

[Back to TS setup](typescript.md)

**Draft for coordination with [TS issue #118](https://github.com/abruption/session-peer-ts/issues/118), 2026-10-07.** This document incorporates the Python owner's planning boundaries and proposes an agreement on contract semantics and rollout order. Planning agreement does not authorize runtime implementation, experiments, merge, installation, pin changes, or publication. Candidate metadata numbers and any new schema remain unapproved.

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

The published check applies a **64 KiB pre-read size check** using file stat, then reads named local entrypoint files and interprets only their frontmatter. This is not evidence of an enforced read-time byte budget or descriptor identity check if a file changes while being read. Future bounded-reader acceptance belongs to TS issue #118; no read race was reproduced in this document review. The check does not run instructions, traverse references, fetch sources, install, or update. `compatible` with `verification: metadata_only` means the metadata tuple matched; it does not verify the installed content hash or approve a send. Unreadable or unparseable input can be `unknown`, a missing path is `missing`, and a parseable mismatch is `incompatible`. Every inspected path must be assessed independently. Retaining this tuple in the changed Draft proves neither instruction-body compatibility nor tested acceptance by an installed doctor.

Public runtime 0.3.2 rejects a successor tuple as `incompatible`. Users should keep the supported published TS skill/content or, once separately approved and available, update to the specifically reviewed guard runtime before choosing its successor skill. Do not lower or edit metadata to silence a mismatch. Upgrade guidance must preserve the owning manager; unknown ownership gets an explanation rather than a guessed replacement command. A source pin, fixture pass, or unpublished guard is not evidence that the required runtime has shipped.

## Proposed bounded successor

Keep the existing string-map schema and status envelope. Review a finite set of supported profiles instead of accepting arbitrary later versions, a wildcard, or every value greater than `0.1.0`.

| Profile | Skill version | CLI compatibility minimum | Full CLI coverage reference | Doctor acceptance | Policy |
|---|---|---|---|---|---|
| Existing published profile | `0.1.0` | `0.1.0` | `0.1.0` historical baseline | Exact tuple accepted by public doctor 0.3.2; no blanket runtime matrix claim | `probe-help` |
| Candidate for discussion | `0.2.0` | `0.1.0` baseline commands | `0.3.2` published additions | Rejected by public doctor 0.3.2; first supporting guard release remains unapproved (possibly 0.3.3) | `probe-help` |

Both profiles require `runtime-implementation: "typescript"`. The candidate numbers are proposals, not approved metadata or a released skill. The Draft instruction changes retain the old frontmatter to avoid unilaterally changing the contract during review; they must not be published as a new artifact under the old version.

### Minimum, full features, and guard acceptance

- `runtime-min-version` MUST mean the CLI compatibility floor for this skill's explicitly documented baseline command path in the named implementation. A runtime below it is unsupported. It MUST NOT be treated as the latest security recommendation or the minimum for every optional feature. An older compatible baseline is distinct from the patch version recommended for safe operation. The independent Python contract remains minimum `0.9.1`, full `1.0.1`, and security recommendation `1.0.3+`; this TS proposal does not change it.
- `runtime-full-version` MUST mean the coverage reference for the published CLI feature set that this skill revision guides users to use. It MUST NOT mean the latest version or guarantee every runtime feature, every platform/native-agent version, remote provisioning, delivery/ACK, or security patch level. Unsupported-feature descriptions and future designs MUST NOT count toward coverage.
- Between minimum and full, each optional operation beyond the baseline MUST be gated by its feature-specific version and affirmative help from the resolved TS executable. At or above full, actual platform/native prerequisites, allowlists, permissions, and unique-writer guards still take precedence. Help demonstrates option presence only; it MUST NOT be treated as evidence of execution feasibility, authorization, or a live test.
- Doctor profile acceptance MUST remain a separate, explicitly reviewed finite runtime/profile matrix. A coverage reference does not establish that its older doctor accepts later skill metadata. `compatible` with `metadata_only` MUST mean only the structural check of a reviewed profile and supported runtime combination; it MUST NOT imply content SHA verification, automatic updates, network access, send permission, full CLI coverage, consumption, or ACK.

For example, the proposed full-feature baseline `0.3.2` would not change public 0.3.2 doctor's rejection of the successor. A separately reviewed guard release, possibly TS 0.3.3, would need to accept the specifically agreed legacy and successor fixtures. That release number is a planning candidate, not an implementation or publication approval. Doctor must not label an unreviewed runtime/profile combination compatible, and no generic future-version compatibility is proposed.

The proposed future checker should also validate top-level `name: session-peer-ts`, the TypeScript implementation, and the actual reviewed runtime/profile combination. This is a proposal beyond the current exact metadata check.

These outcomes are proposed policy, not a description of every published result. In public 0.3.2, missing or duplicate required fields can produce a tuple mismatch (`incompatible`), while absent or multiple metadata sections are `unknown`. Any change to that distinction needs explicit TS fixture review.

| Evidence | Proposed outcome |
|---|---|
| Entry point absent | `missing` |
| Unreadable/oversized input, missing required fields, malformed or conflicting/duplicate metadata | `unknown` |
| Valid but unsupported name, implementation, skill/profile/version, min/full value, or runtime/profile combination | `incompatible` |
| Explicitly reviewed profile and runtime combination | `compatible`, limited to `metadata_only` |

Preserve path, status/code, and inspection scope in the result so users can distinguish unsupported metadata from unavailable evidence. Additional result fields or a new schema/policy need separate review; a verdict must not imply an unperformed capability test. Skill inspection must not invoke runtime executables, make network requests, read instruction bodies for execution, install/update anything, or authorize discovery/delivery. Source provenance and content review remain separate.

## Rollout order and gates

1. **Agree on the plan and fixtures.** TS and skill owners review the content, exact profile tuple, min/full meanings, status/evidence policy, and finite runtime matrix. The Python owner has supplied planning constraints; this does not approve candidate numbers, code, or publication. Preserve Python's published runtime, canonical skill metadata, compatibility snapshot, and parity/reference pins.
2. **Authorize and verify the guard separately.** Only with separate runtime implementation authorization does the TS owner prepare doctor support and tests in TS issue #118. Test the existing fixture and the explicitly agreed successor, wrong name/implementation, unsupported min/full and runtime versions, missing/duplicate/conflicting fields, malformed metadata, and unknown future profiles. Agree on and verify future bounded-reader acceptance separately from the published pre-read size check. Verify no body execution, installation, update, or network access by skill inspection. The current Draft does not implement or satisfy this gate.
3. **Publish and confirm the guard runtime first.** Obtain its separate merge/release approvals and record the actual public runtime version, source/artifact evidence, and accepted profile matrix. Until that runtime has shipped, do not claim successor compatibility. Existing 0.3.2 rejection and manager-owned upgrade guidance must remain explicit.
4. **Finalize and publish the successor skill second.** After the public guard evidence and separate skill authorization, finalize the agreed metadata and validation expectations, review the immutable skill-source commit, and update TS four-language guidance and PARITY with the same reviewed pin. Publish only through its own approval process; do not move existing tags or make the Draft SHA an approved installation pin.
5. **Leave adoption to explicit user choices.** Users update their runtime and skill separately with the existing managers. No postinstall, automatic deployment, PATH replacement, remote provisioning, or global skill update is implied.

Public TS 0.2/0.3 capability documentation remains separate from unshipped 0.4 designs. Preserve exact-version SSH peers, implementation-specific optional result fields, manager ownership, and queued/submitted versus consumption/ACK distinctions. No general wait, Relay, MCP, wake, or Antigravity support is added. This Draft is documentation planning; it is not a substitute for TS-side guard tests or a live consumption/ACK check.
