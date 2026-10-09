# TypeScript skill compatibility proposal

[Back to TS setup](typescript.md)

**Draft for coordination with [TS issue #118](https://github.com/abruption/session-peer-ts/issues/118), opened 2026-10-07.** This document incorporates the Python owner's planning boundaries and records the contract review and rollout order. Design acceptance does not authorize runtime merge/release, skill publication, installation, or pin changes. The successor tuple is accepted as a design and fixture profile only; final skill metadata and publication remain separate approval gates.

**Coordination status (2026-10-09):** rollout order and min/full meanings were accepted at planning level. Full design-only review of TS #126 head `ba18bb806a6ba503381259b4255211af3adc0336` (design SHA-256 `3d003cb3541add314941a8d72dc03648f4cabf7ab5a6d3a83d60ff8cc24fb8ea`) and release Draft #129 head `bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c` (design SHA-256 `43244535795e22e720516415d79766cffa017b59daf9f070e1cfae632d19fbd1`) accepts the finite profile matrix, limited parser/status envelopes, G07 root-name rule, and B04 reader fixtures for those exact candidates. The `rootOwner` fix rejects name continuations and orphan indentation while preserving ignored unrelated-field children; B04 now asserts the first returned chunk is four bytes. Both PRs remain OPEN/Draft, with 12/12 latest-head checks successful and no submitted current-head PR reviews. This is read-only source, test, and document review plus CI-status confirmation; no tests were rerun here, and it does not establish publication, installation, live delivery, consumption, or ACK. The candidate 0.3.3 runtime and successor skill remain unpublished; public TS 0.3.2 behavior is unchanged.

## Current published contract

The npm 0.3.2 publication source is [`f335f07352c842f2f6ceb12bd2ca6274b52f69f7`](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/RELEASING.md). Its [`inspectSkills`](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/src/diagnostics.ts) requires these exact values:

| Field | Published accepted value |
|---|---|
| `version` | `0.1.0` |
| `runtime-implementation` | `typescript` |
| `runtime-min-version` | `0.1.0` |
| `runtime-full-version` | `0.1.0` |
| `runtime-capability-policy` | `probe-help` |

The current repository tag `v0.3.2` and the previously reviewed skill commit `081cc3c1d16a394bd92824333f4bc61c36951799` contain the same TS skill bytes (SHA-256 `b0c323a54274be525c9862629b3ed3c4c3c6903821999e1b4b0f23585bc05634`). Its actual frontmatter has one root name and the exact legacy metadata map and fits the candidate's stated limited grammar on static inspection. The repository tag is the Python skill release; it is not a TS skill or npm version.

The published check applies a **64 KiB pre-read size check** using file stat, then reads named local entrypoint files and interprets only their frontmatter. `metadata_only` describes inspection without instruction execution; it is not a privacy guarantee that body bytes are never read. This is not evidence of an enforced read-time byte budget or descriptor identity check if a file changes while being read. Future bounded-reader acceptance belongs to TS issue #118; no read race was reproduced in this document review. The check does not run instructions, traverse references, fetch sources, install, or update. `compatible` with `verification: metadata_only` means the metadata tuple matched; it does not verify provenance, the installed content hash, installation integrity, or approve a send or ACK. Every inspected path must be assessed independently. Retaining this tuple in the changed Draft proves neither instruction-body compatibility nor tested acceptance by an installed doctor.

### Published status and code behavior

The fixed source's current results are:

| Evidence reaching the skill checker | Current status | Current code | `verification` field |
|---|---|---|---|
| `ENOENT`/`ENOTDIR` reaching its catch | `missing` | `skill_missing` | Absent |
| `EACCES`/`EPERM` reaching its catch | `permission_denied` | `permission_denied` | Absent |
| Other caught error, non-regular file, or pre-read size over 64 KiB | `unknown` | `skill_metadata_unreadable` | Absent |
| Missing/empty frontmatter or zero/multiple metadata sections | `unknown` | `skill_metadata_missing` | Absent |
| Single metadata section, but a required scalar is missing, duplicated, regex-nonmatching, or does not equal the exact tuple | `incompatible` | `skill_contract_mismatch` | `metadata_only` |
| Single metadata section with the exact legacy tuple | `compatible` | `skill_contract_compatible` | `metadata_only` |

Do not merge the permission result into `unknown` when the raw permission error reaches that catch. Path canonicalization can wrap some earlier resolution errors as `home_resolution_failed`, which the skill checker instead reports as `unknown`/`skill_metadata_unreadable`; the table is not a guarantee that all permission failures retain their original errno. This is a static source review, not an error or race reproduction. The published checker does not validate top-level skill `name`.

Public runtime 0.3.2 rejects a successor tuple as `incompatible`. Users should keep the supported published TS skill/content or, once separately approved and available, update to the specifically reviewed guard runtime before choosing its successor skill. Do not lower or edit metadata to silence a mismatch. Upgrade guidance must preserve the owning manager; unknown ownership gets an explanation rather than a guessed replacement command. A source pin, fixture pass, or unpublished guard is not evidence that the required runtime has shipped.

## Proposed bounded successor

Keep the existing string-map schema and status envelope. Review a finite set of supported profiles instead of accepting arbitrary later versions, a wildcard, or every value greater than `0.1.0`.

| Profile | Skill version | CLI compatibility minimum | Full CLI coverage reference | Doctor acceptance | Policy |
|---|---|---|---|---|---|
| Existing published profile | `0.1.0` | `0.1.0` | `0.1.0` historical baseline | Exact tuple accepted by public doctor 0.3.2; no blanket runtime matrix claim | `probe-help` |
| Candidate for discussion | `0.2.0` | `0.1.0` baseline commands | `0.3.2` published additions | Rejected by public doctor 0.3.2; design-only support is accepted for the exact 0.3.3 candidate, which remains unpublished | `probe-help` |

Both profiles require `runtime-implementation: "typescript"`. The successor tuple is accepted as a contract/fixture profile only; it is not approved or released skill metadata. The Draft instruction changes retain the old frontmatter to avoid unilaterally changing the contract during review; they must not be published as a new artifact under the old version.

### Finite runtime/profile verdicts

This matrix separates current source behavior from future acceptance proposals. Minimum/full arithmetic MUST NOT replace explicitly reviewed runtime/profile support.

| Exact runtime | Exact profile | Verdict and evidence scope |
|---|---|---|
| Public TS `0.3.2` | Published legacy tuple above | Current metadata-match `compatible`, `verification: metadata_only`; no content or live-delivery verification |
| Public TS `0.3.2` | Candidate successor tuple above | Current `incompatible`, even though the runtime meets the candidate minimum/full values |
| Proposed TS `0.3.3` | Legacy tuple | Design-only accepted for the exact candidate matrix and fixtures; compatible support still requires the guard runtime to be published |
| Proposed TS `0.3.3` | Agreed successor tuple | Design-only accepted for the exact candidate matrix and fixtures; candidate source remains an open Draft and runtime publication is a separate gate |
| Unknown/unreviewed runtime or profile combination | Any unsupported combination | No automatic `compatible` guarantee; use the reviewed evidence/status policy, never a future-version wildcard or simple `>=` rule |

The public 0.3.2 source check is an exact tuple comparison, not a runtime-version matrix guard. The finite matrix is implemented in the current TS Draft candidates, but remains unpublished; successful metadata matching under an unreviewed runtime would not establish the proposed support contract.

### Minimum, full features, and guard acceptance

- `runtime-min-version` MUST mean the CLI compatibility floor for this skill's explicitly documented baseline command path in the named implementation. A runtime below it is unsupported. It MUST NOT be treated as the latest security recommendation or the minimum for every optional feature. An older compatible baseline is distinct from the patch version recommended for safe operation. The independent Python contract remains minimum `0.9.1`, full `1.0.1`, and security recommendation `1.0.3+`; this TS proposal does not change it.
- `runtime-full-version` MUST mean the coverage reference for the published CLI feature set that this skill revision guides users to use. It MUST NOT mean the latest version or guarantee every runtime feature, every platform/native-agent version, remote provisioning, delivery/ACK, or security patch level. Unsupported-feature descriptions and future designs MUST NOT count toward coverage.
- Between minimum and full, each optional operation beyond the baseline MUST be gated by its feature-specific version and affirmative help from the resolved TS executable. At or above full, actual platform/native prerequisites, allowlists, permissions, and unique-writer guards still take precedence. Help demonstrates option presence only; it MUST NOT be treated as evidence of execution feasibility, authorization, or a live test.
- Doctor profile acceptance MUST remain a separate, explicitly reviewed finite runtime/profile matrix. A coverage reference does not establish that its older doctor accepts later skill metadata. `compatible` with `metadata_only` MUST mean only the structural check of a reviewed profile and supported runtime combination; it MUST NOT imply content SHA verification, automatic updates, network access, send permission, full CLI coverage, consumption, or ACK.

For example, the full-feature baseline `0.3.2` does not change public 0.3.2 doctor's rejection of the successor. The exact TS 0.3.3 candidate matrix is accepted for design review and has Draft implementation/fixtures; compatible successor support still requires the guard runtime to be merged and published. Doctor must not label an unreviewed runtime/profile combination compatible, and no generic future-version compatibility is proposed.

The candidate checker validates top-level `name: session-peer-ts`, the TypeScript implementation, and the exact reviewed runtime/profile combination. These checks are present only in unpublished Draft candidates; public 0.3.2 retains its published behavior.

These outcomes are candidate policy, not a description of every published result. They intentionally change classification of missing, duplicate, or malformed required scalars from the published exact-value mismatch to `unknown`. The current Draft candidates implement and test these changes for legacy and successor fixtures while retaining the inspection envelope. The published error/unknown results lack `verification`; adding it to those results would be another explicit envelope change, not an existing guarantee. None of these candidate changes is in public TS 0.3.2.

| Evidence | Proposed outcome |
|---|---|
| Entry point absent (`ENOENT`/`ENOTDIR`) | `missing` |
| Permission error (`EACCES`/`EPERM`) | Preserve `permission_denied` status/code |
| Other unreadable/oversized/non-regular input, missing required fields, malformed or conflicting/duplicate metadata | `unknown` |
| Valid but unsupported name, implementation, skill/profile/version, min/full value, or runtime/profile combination | `incompatible` |
| Explicitly reviewed profile and runtime combination | `compatible`, limited to `metadata_only` |

Preserve path, status/code, and inspection scope in the result so users can distinguish unsupported metadata from unavailable evidence. Additional result fields or a new schema/policy need separate review; a verdict must not imply an unperformed capability test. Skill inspection must not invoke runtime executables, make network requests, read instruction bodies for execution, install/update anything, or authorize discovery/delivery. Source provenance and content review remain separate.

## Fixture manifest for review

Use the exact published legacy and candidate successor tuples above as distinct inputs. Each parameter listed below is a separate fixture instance, not a combined mutation; in L07/L08 all other fields and sections remain valid. These are source-derived legacy expectations and **unapproved successor expectations**, not test results. Guard identity means verifiable version/profile evidence for the runtime performing the inspection itself, supplied without launching an external executable. Future fixtures model that evidence internally; no executable, installation, or hypothetical runtime below the minimum is invoked by this document work.

### Published behavior fixtures

These cases anchor public source `f335f07352c842f2f6ceb12bd2ca6274b52f69f7`. Status/code/verification expectations are the published table above, including absent `verification` on missing/permission/unknown results.

| ID | Independent input case | Public 0.3.2 expectation |
|---|---|---|
| L01 | Exact legacy tuple | `compatible` / `skill_contract_compatible`, `metadata_only` |
| L02 | Candidate successor tuple | `incompatible` / `skill_contract_mismatch`, `metadata_only` |
| L03 | Raw `ENOENT`; raw `ENOTDIR`, each reaching catch | `missing` / `skill_missing` |
| L04 | Raw `EACCES`; raw `EPERM`, each reaching catch | `permission_denied` / `permission_denied` |
| L05 | Other caught error; wrapped path-resolution refusal; non-regular file; pre-read size over 65,536 bytes | `unknown` / `skill_metadata_unreadable` |
| L06 | No frontmatter; empty frontmatter; zero metadata sections; multiple metadata sections | `unknown` / `skill_metadata_missing` |
| L07 | For each required scalar: omit it; duplicate it with equal values; duplicate it with conflicting values; use a value whose scalar line fails the published regex | `incompatible` / `skill_contract_mismatch`, `metadata_only` |
| L08 | For each required scalar: one parseable but unsupported value | `incompatible` / `skill_contract_mismatch`, `metadata_only` |
| L09 | Legacy tuple with missing or different top-level `name` | Current tuple still matches: `compatible`, `metadata_only`; name is not checked |

The required scalars in L07/L08 are `version`, `runtime-implementation`, `runtime-min-version`, `runtime-full-version`, and `runtime-capability-policy`. These legacy cases must retain their current expected results in the published-source fixture group; a future checker uses a separate group to show intentional changes.

### Proposed guard fixtures

The candidate envelope retains current `path`, status/code, and `verification` placement: compatible/incompatible structural results carry `metadata_only`; missing/permission/unknown results do not gain a verification field automatically. G04 below fixes one exact status/code result with `verification` omitted; this is not `verification: null` and does not add verification to other unknown results. Candidate implementation and CI fixtures exist at the exact heads above, but no `compatible` expectation here means the guard is merged, published, installed, or authorizes delivery.

| ID | Independent input case | Proposed expected status and inspection scope |
|---|---|---|
| G01 | Explicitly reviewed guard identity × exact legacy profile; separately, that guard × agreed successor profile | Design-only accepted for the exact #126/#129 candidate matrix and fixtures; the candidate remains unpublished, so no public compatibility claim |
| G02 | Valid runtime identity below the profile's declared minimum | `incompatible`, `metadata_only`; baseline must not be used |
| G03 | Valid but unreviewed runtime identity, including a later/future version outside the finite matrix | `incompatible`, `metadata_only`; no wildcard or arithmetic acceptance |
| G04 | Healthy bounded, readable, stable UTF-8 legacy and successor metadata, tested separately, with an explicitly unavailable or malformed inspecting-runtime identity, including ambiguous non-scalar evidence | Metadata verdict exactly `unknown` / `skill_metadata_missing`; the inspection result retains `path`; `verification` MUST be absent, not `null` |
| G05 | Each valid but unreviewed skill version/profile, minimum value, full value, or policy value | `incompatible`, `metadata_only` |
| G06 | Different valid top-level name; different valid implementation | `incompatible`, `metadata_only`; name validation is a new check |
| G07 | Missing, malformed, or duplicate/conflicting required name/scalar; structurally invalid scalar/map shape, after readable bounded regular-file, valid UTF-8, and stable file/path evidence | `unknown` / `skill_metadata_missing`; `verification` absent, not `null`; intentional change from L07 for required metadata scalars |
| G08 | L03/L04 missing or raw permission errors | Preserve `missing` / `skill_missing` and `permission_denied` / `permission_denied` respectively |
| G09 | L05/L06 input failures and structure failures | Preserve `unknown / skill_metadata_unreadable` for L05 and `unknown / skill_metadata_missing` for L06; `verification` stays absent, with no raw permission-error merging |
| G10 | Valid profile plus unmet optional platform/native/permission/writer prerequisites | Structural verdict stays within the reviewed matrix; no verdict permits the optional operation or proves delivery/ACK |

For a valid runtime identity, the matrix applies only after required profile fields pass the limited grammar; malformed or missing fields are G07 `unknown`, not matrix `incompatible`. Invalid runtime identity is G04 `unknown` before frontmatter parsing. G02/G03 are profile-support rejection cases, distinct from G04's unavailable runtime evidence. Full coverage does not substitute for matrix membership. G07's scalar classification and name check intentionally differ from public 0.3.2. Full design-only acceptance applies to the exact candidate heads recorded above; it does not alter public 0.3.2 behavior or approve a merge, runtime release, published skill metadata, or installation pin.

For G04, pair each unavailable or malformed runtime identity with healthy bounded metadata and stable UTF-8 file/path evidence. The helper fixtures at [#126 head `ba18bb8`](https://github.com/abruption/session-peer-ts/blob/ba18bb806a6ba503381259b4255211af3adc0336/test/skill-metadata.test.ts) and [#129 head `bfb3d6f`](https://github.com/abruption/session-peer-ts/blob/bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c/test/skill-metadata.test.ts) test the legacy and successor profiles separately with `null`, `{}`, `0`, an empty string, a prerelease string such as `0.3.3-preview.1`, and a noncanonical string such as `00.3.3`; each returns exactly `{ status: 'unknown', code: 'skill_metadata_missing' }`, without a `verification` property. An omitted or explicitly `undefined` helper argument uses the compiled `VERSION` default and is not an unavailable-identity fixture: #126 covers omission and excludes `undefined` from its malformed-input loop, while #129 asserts that both omission and `undefined` use the compiled default. The outer `inspectSkill` result retains `path` and adds no `verification`. A valid but unreviewed stable runtime such as `0.3.4` is G03 and returns `incompatible / skill_contract_mismatch / metadata_only`. Reader I/O, overflow, invalid UTF-8, or unstable-file failures keep their earlier envelopes. The helper checks runtime identity before parsing frontmatter, so these fixtures establish the G04 envelope for healthy metadata inputs but do not define precedence when runtime identity and frontmatter are both invalid; both paths return `unknown / skill_metadata_missing`. The [#126 design](https://github.com/abruption/session-peer-ts/blob/ba18bb806a6ba503381259b4255211af3adc0336/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [#129 design](https://github.com/abruption/session-peer-ts/blob/bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) describe the exact candidate envelopes; this is not evidence of a published runtime.

For G07, require readable bounded regular-file evidence, valid UTF-8, and stable file/path evidence before evaluating frontmatter. At TS #126 head `ba18bb806a6ba503381259b4255211af3adc0336` and release Draft #129 head `bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c`, separate missing, duplicate, and malformed name/map/required-scalar inputs return exactly `{ status: 'unknown', code: 'skill_metadata_missing' }` from `validateSkillMetadata`, with no `verification` property. `inspectSkill` retains the path and adds no `verification`. The `rootOwner` scan preserves a root `name` owner across blank/comments, rejects non-comment continuation and orphan indentation, and leaves indented children of unrelated root fields in that field's ignored scope. The focused fixture checks both profiles, plain and quoted names before metadata, a quoted name after metadata, continuation shapes, comments/blanks, orphan content, exact outer inspection results, and positive controls. Well-formed but unsupported name or scalar values return `incompatible / skill_contract_mismatch / metadata_only`. Reader I/O, invalid UTF-8, overflow, or conflicting file/path evidence retain `unknown / skill_metadata_unreadable` and do not become G07 results. See the exact [#126 design](https://github.com/abruption/session-peer-ts/blob/ba18bb806a6ba503381259b4255211af3adc0336/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/ba18bb806a6ba503381259b4255211af3adc0336/test/skill-metadata.test.ts), plus the [#129 design](https://github.com/abruption/session-peer-ts/blob/bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c/test/skill-metadata.test.ts). The G07 blocker from the previous review is resolved at these heads; public TS 0.3.2 behavior and candidate 0.3.3 publication remain separate.

The previous G07 counterexample is fixed in both candidates. The root scan tracks the most recent root field, keeps that owner across blank/comment lines, rejects indented non-comment content when no field owns it or when `name` owns it, and permits ignored children only under unrelated root fields. The new fixture checks plain/quoted names before metadata and quoted names after metadata; one-, two-, and four-space and nested-looking continuations; comment/blank-separated cases; orphan indentation; and exact `inspectSkill` results. It also verifies that unrelated field children and instruction-body lines remain ignored. This resolves the prior compatible-on-malformed-name finding.

Two syntax details remain nonblocking fixture-precision follow-ups before freezing the parser grammar: the candidate accepts a plain name after the metadata map in source flow, but the focused after-map fixture uses a quoted name; and a tab immediately after `name:` is rejected, while a literal space followed by a tab before the scalar is accepted because the implementation requires a literal space then applies `trimStart()`. The design should either explicitly define and fixture the latter form or tighten the parser in separately authorized runtime work. These details do not reopen the tested continuation/orphan-indentation finding or change the reviewed status envelopes.

The candidate fixtures distinguish G05 well-formed but unsupported scalar values from G07 structurally invalid or missing/duplicate name, map, and scalar inputs. A line rejected by the published regex is not automatically semantically malformed under the future parser; the proposed limited grammar defines that distinction. Each fixture has its own status, reason code, and `verification` presence/absence. The root-name continuation counterexample is now tested and returns `unknown / skill_metadata_missing`. Candidate tuples and passing draft checks do not make public TS 0.3.2 accept the successor.

### Future reader and side-effect acceptance

Reader acceptance was agreed for this design and is implemented in the current #126/#129 Draft candidates. Their latest-head CI is successful, but neither candidate is merged or public. The budget is the existing 65,536-byte threshold, with the read-time checks below; a pre-read stat alone does not establish it.

| ID | Future acceptance evidence required |
|---|---|
| B01 | Reject non-regular input without blocking on special files; test the exact size boundary and oversize input |
| B02 | Enforce an actual read-byte budget, including a bounded overflow-detection allowance if agreed, when a file grows after stat; specify allocation/read bounds independently of parser behavior |
| B03 | Verify the opened descriptor's regular-file status and identity against inspected evidence; replacement, symlink changes, or conflicting evidence must not produce compatibility for different bytes |
| B04 | Test growth, truncation, replacement, and malformed-content races using bounded controlled fixtures. For the proposed malformed-content rewrite cases, require `unknown / skill_metadata_unreadable`, preserved path, absent `verification`, bounded reads/allocation, and one close of the inspected descriptor; do not treat a race as a tuple verdict |
| B05 | Close every opened descriptor on success and each error/early return and clean only the test-owned temporary files; demonstrate resource cleanup without modifying installed skills |
| B06 | Demonstrate no body instruction/reference execution, network requests, runtime/native-agent execution, installation, update, send, or user-state writes during skill inspection; reading body bytes is not prohibited by `metadata_only` |

These acceptance conditions are implemented in the current candidate source and controlled fixtures, not a deadline guarantee for arbitrary filesystem I/O or a reproduced production bug. The companion PR's checks do not execute TS runtime code. The TS #126/#129 latest-head checks support only their encoded assertions; they do not establish atomic snapshots, protection against a writer that restores matching metadata, arbitrary-I/O deadlines, installation behavior, or delivery/ACK.

The TS #118 design defines the budget as whole-file raw UTF-8 bytes, including BOM, whitespace, line endings, and body, with one overflow-detection byte and a 65,537-byte read/allocation cap. It checks descriptor/path identity before and after the read, and its controlled fixtures assert unknown on growth, truncation, replacement, observable same-size change, and the B04 malformed-content rewrite cases. The B04 wrapper caps each read at four bytes, rewrites after the first nonempty read, and now asserts outside the reader catch that the first returned chunk contains exactly four bytes. It verifies the same inode and size, changed timestamp, returned chunks equal to the malformed payload, `unknown / skill_metadata_unreadable`, preserved path, absent `verification`, bounded reads/allocation, and one close of the inspected descriptor. The `malformed-scalar` case distinguishes stability rejection from the parser's `skill_metadata_missing` result. The invalid-UTF-8 case alone would also be unreadable if decoding were reached without the stability check; source order places the stability check before `TextDecoder`, but the fixture does not instrument decoder invocation. No atomic snapshot, protection against a writer restoring matching metadata, or enforced deadline for arbitrary filesystem I/O is promised.

## Rollout order and gates

1. **Agree on the plan and fixtures.** TS and skill owners have reviewed the content, exact profile tuple, min/full meanings, status/evidence policy, and finite runtime matrix for the heads recorded above. The design acceptance does not approve publication values. Preserve Python's published runtime, canonical skill metadata, compatibility snapshot, and parity/reference pins, including TS's existing Python `1.0.2` reference/parity pin.
2. **Verify the guard candidate.** The current TS #126/#129 Drafts contain the doctor guard and tests for the legacy/successor matrix, wrong name/implementation, unsupported min/full and runtime versions, missing/duplicate/conflicting fields, malformed metadata, and unknown future profiles. Current-head CI passes; this review did not rerun tests. The guard is not merged or published, so the compatibility promise is not yet available to users. No body execution, installation, update, or network access is implied by skill inspection.
3. **Publish and confirm the guard runtime first.** Obtain its separate merge/release approvals and record the actual public runtime version, source/artifact evidence, and accepted profile matrix. Until that runtime has shipped, do not claim successor compatibility. Existing 0.3.2 rejection and manager-owned upgrade guidance must remain explicit.
4. **Finalize and publish the successor skill second.** After the public guard evidence and separate skill authorization, finalize the agreed metadata, content, and validation expectations and review the immutable skill-source commit. Publish through its own approval process, then update TS four-language guidance and PARITY with that same reviewed published pin. Do not move existing tags or make the Draft SHA an approved installation pin.
5. **Leave adoption to explicit user choices.** Users update their runtime and skill separately with the existing managers. No postinstall, automatic deployment, PATH replacement, remote provisioning, or global skill update is implied.

Public TS 0.2/0.3 capability documentation remains separate from unshipped 0.4 designs. Preserve exact-version SSH peers, implementation-specific optional result fields, manager ownership, and queued/submitted versus consumption/ACK distinctions. No general wait, Relay, MCP, wake, or Antigravity support is added. This companion record is not a substitute for published guard evidence or a live consumption/ACK check.
