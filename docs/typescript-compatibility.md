# TypeScript skill compatibility proposal

[Back to TS setup](typescript.md)

**Draft for coordination with [TS issue #118](https://github.com/abruption/session-peer-ts/issues/118), 2026-10-07.** This document incorporates the Python owner's planning boundaries and proposes an agreement on contract semantics and rollout order. Planning agreement does not authorize runtime implementation, experiments, merge, installation, pin changes, or publication. Candidate metadata numbers and any new schema remain unapproved.

**Coordination status:** the owners agree on rollout order and min/full meanings at planning level. The TS owner accepted the fixture direction at exact head `4ec8b69f4f2dd97b25b8e67e473042d76e9e0453`, with no further planning blocker and exact expectations still open in TS issue #118. That review does not freeze later edits, profile numbers, parser/envelope details, or reader design. The manifest is a documentation proposal, not an implemented or executed test suite.

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
| Candidate for discussion | `0.2.0` | `0.1.0` baseline commands | `0.3.2` published additions | Rejected by public doctor 0.3.2; first supporting guard release remains unapproved (possibly 0.3.3) | `probe-help` |

Both profiles require `runtime-implementation: "typescript"`. The candidate numbers are proposals, not approved metadata or a released skill. The Draft instruction changes retain the old frontmatter to avoid unilaterally changing the contract during review; they must not be published as a new artifact under the old version.

### Finite runtime/profile verdicts

This matrix separates current source behavior from future acceptance proposals. Minimum/full arithmetic MUST NOT replace explicitly reviewed runtime/profile support.

| Exact runtime | Exact profile | Verdict and evidence scope |
|---|---|---|
| Public TS `0.3.2` | Published legacy tuple above | Current metadata-match `compatible`, `verification: metadata_only`; no content or live-delivery verification |
| Public TS `0.3.2` | Candidate successor tuple above | Current `incompatible`, even though the runtime meets the candidate minimum/full values |
| Proposed TS `0.3.3` | Legacy tuple | Future proposal only: accept this exact combination only after explicit review, guard tests, and actual runtime publication |
| Proposed TS `0.3.3` | Agreed successor tuple | Future proposal only under the same gates; candidate numbers, implementation, and publication remain unapproved |
| Unknown/unreviewed runtime or profile combination | Any unsupported combination | No automatic `compatible` guarantee; use the reviewed evidence/status policy, never a future-version wildcard or simple `>=` rule |

The current source check is an exact tuple comparison, not a runtime-version matrix guard. The proposed finite matrix is not implemented by this Draft; successful metadata matching under an unreviewed runtime would not establish the proposed support contract.

### Minimum, full features, and guard acceptance

- `runtime-min-version` MUST mean the CLI compatibility floor for this skill's explicitly documented baseline command path in the named implementation. A runtime below it is unsupported. It MUST NOT be treated as the latest security recommendation or the minimum for every optional feature. An older compatible baseline is distinct from the patch version recommended for safe operation. The independent Python contract remains minimum `0.9.1`, full `1.0.1`, and security recommendation `1.0.3+`; this TS proposal does not change it.
- `runtime-full-version` MUST mean the coverage reference for the published CLI feature set that this skill revision guides users to use. It MUST NOT mean the latest version or guarantee every runtime feature, every platform/native-agent version, remote provisioning, delivery/ACK, or security patch level. Unsupported-feature descriptions and future designs MUST NOT count toward coverage.
- Between minimum and full, each optional operation beyond the baseline MUST be gated by its feature-specific version and affirmative help from the resolved TS executable. At or above full, actual platform/native prerequisites, allowlists, permissions, and unique-writer guards still take precedence. Help demonstrates option presence only; it MUST NOT be treated as evidence of execution feasibility, authorization, or a live test.
- Doctor profile acceptance MUST remain a separate, explicitly reviewed finite runtime/profile matrix. A coverage reference does not establish that its older doctor accepts later skill metadata. `compatible` with `metadata_only` MUST mean only the structural check of a reviewed profile and supported runtime combination; it MUST NOT imply content SHA verification, automatic updates, network access, send permission, full CLI coverage, consumption, or ACK.

For example, the proposed full-feature baseline `0.3.2` would not change public 0.3.2 doctor's rejection of the successor. A separately reviewed guard release, possibly TS 0.3.3, would need to accept the specifically agreed legacy and successor fixtures. That release number is a planning candidate, not an implementation or publication approval. Doctor must not label an unreviewed runtime/profile combination compatible, and no generic future-version compatibility is proposed.

The proposed future checker should also validate top-level `name: session-peer-ts`, the TypeScript implementation, and the actual reviewed runtime/profile combination. This is a proposal beyond the current exact metadata check.

These outcomes are proposed policy, not a description of every published result. They intentionally change classification of missing, duplicate, or malformed required scalars from the published exact-value mismatch to `unknown`. Review legacy and successor fixtures separately, including intended status/code changes and the inspection envelope. The published error/unknown results lack `verification`; adding it to those results would be another explicit envelope change, not an existing guarantee. No such runtime changes are implemented by this Draft.

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

The default proposed envelope retains current `path`, status/code, and `verification` placement: compatible/incompatible structural results carry `metadata_only`; missing/permission/unknown results do not gain a verification field automatically. G04 below proposes one exact status/code result with `verification` omitted; this is not `verification: null` and does not add verification to other unknown results. Other changed classifications, fields, or codes still require explicit #118 review. No proposed `compatible` expectation below is a claim that a supporting guard is implemented, tested, approved, or public.

| ID | Independent input case | Proposed expected status and inspection scope |
|---|---|---|
| G01 | Explicitly reviewed guard identity × exact legacy profile; separately, that guard × agreed successor profile | Proposed `compatible`, `metadata_only`, only after exact combinations are accepted, the parser contract is satisfied, guard tests pass, and the guard is published; currently unconfirmed |
| G02 | Valid runtime identity below the profile's declared minimum | `incompatible`, `metadata_only`; baseline must not be used |
| G03 | Valid but unreviewed runtime identity, including a later/future version outside the finite matrix | `incompatible`, `metadata_only`; no wildcard or arithmetic acceptance |
| G04 | Healthy bounded, readable, stable UTF-8 legacy and successor metadata, tested separately, with an explicitly unavailable or malformed inspecting-runtime identity, including ambiguous non-scalar evidence | Metadata verdict exactly `unknown` / `skill_metadata_missing`; the inspection result retains `path`; `verification` MUST be absent, not `null` |
| G05 | Each valid but unreviewed skill version/profile, minimum value, full value, or policy value | `incompatible`, `metadata_only` |
| G06 | Different valid top-level name; different valid implementation | `incompatible`, `metadata_only`; name validation is a new check |
| G07 | Missing, malformed, or duplicate/conflicting required name/scalar; structurally invalid scalar/map shape, after readable bounded regular-file, valid UTF-8, and stable file/path evidence | `unknown` / `skill_metadata_missing`; `verification` absent, not `null`; intentional change from L07 for required metadata scalars |
| G08 | L03/L04 missing or raw permission errors | Preserve `missing` / `skill_missing` and `permission_denied` / `permission_denied` respectively |
| G09 | L05/L06 input failures and structure failures | Preserve `unknown / skill_metadata_unreadable` for L05 and `unknown / skill_metadata_missing` for L06; `verification` stays absent, with no raw permission-error merging |
| G10 | Valid profile plus unmet optional platform/native/permission/writer prerequisites | Structural verdict stays within the reviewed matrix; no verdict permits the optional operation or proves delivery/ACK |

For a valid runtime identity, the matrix applies only after required profile fields pass the limited grammar; malformed or missing fields are G07 `unknown`, not matrix `incompatible`. Invalid runtime identity is G04 `unknown` before frontmatter parsing. G02/G03 are profile-support rejection cases, distinct from G04's unavailable runtime evidence. Full coverage does not substitute for matrix membership. G07's scalar classification and name check are deliberate future changes, not assertions about public 0.3.2. The finite matrix values are a candidate proposal only. Full design acceptance remains open because the current candidate parser can accept malformed root-name syntax as compatible, as described under G07 below. This does not alter public 0.3.2 behavior or approve a release, skill metadata, or installation pin.

For G04, pair each unavailable or malformed runtime identity with healthy bounded metadata and stable UTF-8 file/path evidence. The helper fixtures test the legacy and successor profiles separately with `null`, `{}`, `0`, an empty string, a prerelease string such as `0.3.3-preview.1`, and a noncanonical string such as `00.3.3`; each returns exactly `{ status: 'unknown', code: 'skill_metadata_missing' }`, without a `verification` property. An omitted or explicitly `undefined` helper argument uses the compiled `VERSION` default and is not an unavailable-identity fixture: the #126 fixture covers omission and excludes `undefined` from its malformed-input loop, while #129 explicitly asserts that both omission and `undefined` use the compiled default. The outer `inspectSkill` result retains `path` and adds no `verification`. A valid but unreviewed stable runtime such as `0.3.4` is G03 and returns `incompatible / skill_contract_mismatch / metadata_only`. Reader I/O, overflow, invalid UTF-8, or unstable-file failures keep their earlier envelopes. The helper checks runtime identity before parsing frontmatter, so these fixtures establish the G04 envelope for healthy metadata inputs but do not define precedence when runtime identity and frontmatter are both invalid; both paths return `unknown / skill_metadata_missing`. See the exact [#126 design](https://github.com/abruption/session-peer-ts/blob/d95f00366d65a48a42a52cb853cbfb8c4001b98b/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/d95f00366d65a48a42a52cb853cbfb8c4001b98b/test/skill-metadata.test.ts), plus the [#129 release design](https://github.com/abruption/session-peer-ts/blob/57e42eccc43bc41596a52748ff599707a3fbc93f/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/57e42eccc43bc41596a52748ff599707a3f/test/skill-metadata.test.ts). This is a design review, not evidence of a published runtime.

For G07, require readable bounded regular-file evidence, valid UTF-8, and stable file/path evidence before evaluating frontmatter. At TS #126 head `d95f00366d65a48a42a52cb853cbfb8c4001b98b` and release Draft #129 head `57e42eccc43bc41596a52748ff599707a3fbc93f`, separate missing, duplicate, and malformed name/map/required-scalar inputs return exactly `{ status: 'unknown', code: 'skill_metadata_missing' }` from `validateSkillMetadata`, with no `verification` property. `inspectSkill` retains the path and adds no `verification`. The static G07 cases use the legacy tuple; parsing precedes profile matching, while the valid successor has its own matrix fixture. Well-formed but unsupported name or scalar values return `incompatible / skill_contract_mismatch / metadata_only`. Reader I/O, invalid UTF-8, overflow, or conflicting file/path evidence retain `unknown / skill_metadata_unreadable` and do not become G07 results. See the exact [#126 design](https://github.com/abruption/session-peer-ts/blob/d95f00366d65a48a42a52cb853cbfb8c4001b98b/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/d95f00366d65a48a42a52cb853cbfb8c4001b98b/test/skill-metadata.test.ts), plus the [#129 design](https://github.com/abruption/session-peer-ts/blob/57e42eccc43bc41596a52748ff599707a3fbc93f/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) and [fixture](https://github.com/abruption/session-peer-ts/blob/57e42eccc43bc41596a52748ff599707a3fbc93f/test/skill-metadata.test.ts). This is a design-only contract review; public TS 0.3.2 behavior and candidate 0.3.3 publication remain separate.

The exact G07 envelope is not satisfied by every input allowed by the documented limited grammar yet. In both candidate implementations, the root-line pass allows any line beginning with a space, but only parses lines beginning with `name:` or `metadata:`. A frontmatter file with valid profile fields and `name: "session-peer-ts"` followed by an indented continuation such as `  extra` therefore ignores that line and can return `compatible / skill_contract_compatible / metadata_only`. The grammar defines `name` as one root scalar and does not allow a continuation. The current tests cover missing and duplicate names and malformed metadata scalars/maps, but not this continuation case. Treat this as a G07 blocker: reject unsupported continuation syntax with `unknown / skill_metadata_missing` and add a focused fixture, or explicitly revise the grammar and all affected claims before freezing the contract.

The candidate fixtures distinguish G05 well-formed but unsupported scalar values from G07 structurally invalid or missing/duplicate name, map, and scalar inputs. A line rejected by the published regex is not automatically semantically malformed under the future parser; the proposed limited grammar defines that distinction. Each fixture has its own status, reason code, and `verification` presence/absence. The root-name continuation counterexample remains untested and contradicts the stated G07 result. Candidate numbers do not make public TS 0.3.2 accept the successor.

### Future reader and side-effect acceptance

Reader acceptance must be agreed and demonstrated in separately authorized #118 work. The proposed starting budget is the existing 65,536-byte size threshold, still subject to review; a pre-read stat alone does not establish it.

| ID | Future acceptance evidence required |
|---|---|
| B01 | Reject non-regular input without blocking on special files; test the exact size boundary and oversize input |
| B02 | Enforce an actual read-byte budget, including a bounded overflow-detection allowance if agreed, when a file grows after stat; specify allocation/read bounds independently of parser behavior |
| B03 | Verify the opened descriptor's regular-file status and identity against inspected evidence; replacement, symlink changes, or conflicting evidence must not produce compatibility for different bytes |
| B04 | Test growth, truncation, replacement, and malformed-content races using bounded controlled fixtures. For the proposed malformed-content rewrite cases, require `unknown / skill_metadata_unreadable`, preserved path, absent `verification`, bounded reads/allocation, and one close of the inspected descriptor; do not treat a race as a tuple verdict |
| B05 | Close every opened descriptor on success and each error/early return and clean only the test-owned temporary files; demonstrate resource cleanup without modifying installed skills |
| B06 | Demonstrate no body instruction/reference execution, network requests, runtime/native-agent execution, installation, update, send, or user-state writes during skill inspection; reading body bytes is not prohibited by `metadata_only` |

These are proposed acceptance conditions, not a deadline guarantee for arbitrary filesystem I/O or a reproduced bug. The companion PR's checks do not execute TS runtime code. The TS #126/#129 candidates contain a bounded reader and controlled fixtures, but their CI only supports the assertions encoded by those fixtures; it does not establish atomic snapshots, protection against a writer that restores matching metadata, arbitrary-I/O deadlines, installation behavior, or delivery/ACK.

The TS #118 design defines the budget as whole-file raw UTF-8 bytes, including BOM, whitespace, line endings, and body, with one overflow-detection byte and a 65,537-byte read/allocation cap. It checks descriptor/path identity before and after the read, and its controlled fixtures assert unknown on growth, truncation, replacement, observable same-size change, and the B04 malformed-content rewrite cases. The B04 read wrapper caps each underlying read at four bytes and performs the rewrite after the first nonempty read; the fixture does not assert that the first returned count is exactly four. TS candidate prose saying “first real four-byte read” is therefore slightly more precise than the assertion. This is a nonblocking wording precision issue; the prose can be narrowed to “first nonempty read capped at four bytes” or the fixture can assert a four-byte first read. The `malformed-scalar` rewrite case distinguishes stability rejection from the parser's `skill_metadata_missing` result. The `invalid-utf8` case also returns `skill_metadata_unreadable` if the stability check is absent and the fatal decoder sees malformed bytes, so it does not independently prove rejection before decoding. Incomplete or conflicting read evidence must not be reduced to a tuple mismatch, and no enforced deadline for arbitrary filesystem I/O is promised.

## Rollout order and gates

1. **Agree on the plan and fixtures.** TS and skill owners review the content, exact profile tuple, min/full meanings, status/evidence policy, and finite runtime matrix. The Python owner has supplied planning constraints; this does not approve candidate numbers, code, or publication. Preserve Python's published runtime, canonical skill metadata, compatibility snapshot, and parity/reference pins, including TS's existing Python `1.0.2` reference/parity pin.
2. **Authorize and verify the guard separately.** Only with separate runtime implementation authorization does the TS owner prepare doctor support and tests in TS issue #118. Test the existing fixture and the explicitly agreed successor, wrong name/implementation, unsupported min/full and runtime versions, missing/duplicate/conflicting fields, malformed metadata, and unknown future profiles. Separate legacy and successor classification fixtures and explicitly review intended status/code changes while preserving the inspection envelope. Agree on and verify read-time budget, regular-file, race, and malformed-input acceptance separately from the published pre-read size check. Verify no body execution, installation, update, or network access by skill inspection. The current Draft does not implement or satisfy this gate.
3. **Publish and confirm the guard runtime first.** Obtain its separate merge/release approvals and record the actual public runtime version, source/artifact evidence, and accepted profile matrix. Until that runtime has shipped, do not claim successor compatibility. Existing 0.3.2 rejection and manager-owned upgrade guidance must remain explicit.
4. **Finalize and publish the successor skill second.** After the public guard evidence and separate skill authorization, finalize the agreed metadata, content, and validation expectations and review the immutable skill-source commit. Publish through its own approval process, then update TS four-language guidance and PARITY with that same reviewed published pin. Do not move existing tags or make the Draft SHA an approved installation pin.
5. **Leave adoption to explicit user choices.** Users update their runtime and skill separately with the existing managers. No postinstall, automatic deployment, PATH replacement, remote provisioning, or global skill update is implied.

Public TS 0.2/0.3 capability documentation remains separate from unshipped 0.4 designs. Preserve exact-version SSH peers, implementation-specific optional result fields, manager ownership, and queued/submitted versus consumption/ACK distinctions. No general wait, Relay, MCP, wake, or Antigravity support is added. This Draft is documentation planning; it is not a substitute for TS-side guard tests or a live consumption/ACK check.
