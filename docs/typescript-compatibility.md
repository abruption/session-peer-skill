# TypeScript skill compatibility

[Back to TS setup](typescript.md)

TS skill 0.2.0 uses the successor profile supported by the published npm runtime 0.3.3. Runtime source: [`c0ed30273b9e9c0049df86ae3c38486a94289527`](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/src/skill-metadata.ts). The npm artifact has SHA-256 `3469cda6a7b2c89d42ed2a250d2e7b5b774293fee090968a4b261e824be4c075`; its verified provenance identifies that source and [publication workflow run 37907833518](https://github.com/abruption/session-peer-ts/actions/runs/37907833518).

The Python skill, TS skill, skill release tags, and npm runtime have independent versions. TS skill publication follows the separate `session-peer-ts-vX.Y.Z` tag scheme. A runtime publication does not install or update either skill.

## Published profiles and finite doctor support

| Profile | Skill version | Implementation | CLI minimum | Full coverage reference | Policy |
|---|---|---|---|---|---|
| Legacy | `0.1.0` | `typescript` | `0.1.0` | `0.1.0` | `probe-help` |
| Successor | `0.2.0` | `typescript` | `0.1.0` | `0.3.2` | `probe-help` |

| Inspecting runtime | Legacy | Successor | Scope |
|---|---|---|---|
| Public `0.3.2` | `compatible` | `incompatible` | Exact legacy metadata tuple; top-level name is not checked |
| Public `0.3.3` | `compatible` | `compatible` | Exact supported profile plus valid root `name: session-peer-ts` and bounded readable/stable input |
| Unknown or future combination | No automatic guarantee | No automatic guarantee | Review the actual runtime and profile; no wildcard or arithmetic acceptance |

Compatible and incompatible structural results carry `verification: metadata_only`. This checks metadata structure/profile support; it does not verify source provenance, content SHA, installation integrity, freshness, CLI feature coverage, permission to send, consumption, or ACK. The npm provenance verification above is separate release evidence, not a property of doctor.

Runtime 0.3.3's pure validator rejects a valid but unreviewed runtime identity such as `0.3.4` as `incompatible / skill_contract_mismatch / metadata_only`. This describes the released 0.3.3 guard, not the behavior of hypothetical future code. Use runtime 0.3.3 for the reviewed successor doctor check. An older CLI can meet the minimum while its doctor rejects this newer metadata profile; do not edit metadata to hide that result. Runtime adoption remains a user-authorized operation under the existing package manager.

## Minimum, full features, and guard acceptance

- `runtime-min-version` is the CLI compatibility floor for the explicitly documented baseline command path in the named implementation. A runtime below it is unsupported. It is not a latest-version marker, a security recommendation, or the minimum for every optional feature.
- `runtime-full-version` is this skill revision's coverage reference for the published CLI features it guides users to use. It does not guarantee every runtime feature, platform/native-agent version, remote provisioning, security patch level, permission, delivery, or ACK. Unsupported and future features do not count toward coverage.
- Between minimum and full, gate optional operations by their feature-specific version and affirmative help from the resolved TS executable. At or above full, actual platform/native prerequisites, allowlists, permissions, and unique-writer guards still apply. Help proves option presence only.
- Doctor acceptance is a separate finite runtime/profile contract. Meeting minimum/full numerically does not establish metadata compatibility, and `metadata_only` does not grant network access, installation, update, or send authority.

The independent Python contract remains skill 0.3.2, minimum 0.9.1, full 1.0.1, and the security patch recommendation documented in its own instructions. TS versioning does not change the Python canonical skill, compatibility snapshot, or runtime/reference/parity pins.

## Runtime 0.3.3 input and result contract

The [published limited grammar](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/docs/design/typescript-skill-compatibility.md#limited-grammar-and-results) requires one root name scalar and one metadata map with the required quoted/plain string scalars. This is not a general YAML parser. A root name has no indented non-comment continuation, even across blank/comment lines; orphan indentation is malformed. Unrelated root fields can own ignored indented content. Plain and quoted names work before or after metadata. A literal ASCII space is required after `name:`; following whitespace is removed with `trimStart()`, so a space followed by a tab is accepted, while a tab immediately after the colon is rejected. Metadata separators retain their spaces-only grammar.

| Evidence | Status / code | `verification` |
|---|---|---|
| Absent entrypoint before established file evidence (`ENOENT`/`ENOTDIR`) | `missing / skill_missing` | Absent |
| Raw permission error reaching the reader catch (`EACCES`/`EPERM`) | `permission_denied / permission_denied` | Absent |
| I/O failure, non-regular input, overflow, invalid UTF-8, or conflicting file/path evidence | `unknown / skill_metadata_unreadable` | Absent |
| Missing, duplicate, or malformed required name/map/scalar; unsupported protected syntax | `unknown / skill_metadata_missing` | Absent |
| Healthy bounded metadata plus an unavailable/malformed inspecting-runtime identity | `unknown / skill_metadata_missing` | Absent |
| Well-formed but unsupported name, profile, or valid runtime identity | `incompatible / skill_contract_mismatch` | `metadata_only` |
| Exact supported name/profile/runtime and healthy bounded input | `compatible / skill_contract_compatible` | `metadata_only` |

The outer inspection result preserves `path`. Absent verification means the property is omitted, not `null`. An omitted or explicitly `undefined` pure-helper runtime argument uses compiled VERSION 0.3.3 and is not an unavailable-identity fixture. Reader failures precede metadata verdicts. Canonicalization can wrap an earlier path error as `home_resolution_failed`, producing unknown/unreadable instead of the raw errno result; do not collapse all permission errors into unknown.

For historical comparison, public [0.3.2 source](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/src/diagnostics.ts) does not check root name and classifies missing/duplicate/regex-nonmatching required scalars in a single metadata section as incompatible. Its empty/absent frontmatter and zero/multiple maps are unknown. The 0.3.3 parser classification is an intentional change, not a restatement of the older checker.

## Reader bounds and evidence limits

Runtime 0.3.3 counts **65,536 whole-file raw UTF-8 bytes**, including BOM, whitespace, line endings, and body. Read requests and allocation are capped at **65,537 bytes**, including one overflow-detection byte. Pre-read stat is an early check; fatal UTF-8 decoding follows bounded reading and stability checks.

The reader canonicalizes managed symlinks, verifies regular-file evidence on the opened descriptor, and compares device/inode/size/mtime/ctime and path/alias evidence around the read. Observable growth, truncation, replacement, alias changes, or same-size timestamp changes produce unknown/unreadable. Every opened descriptor is closed. These checks detect observed changes; they do not authenticate content, create an atomic snapshot, protect against a writer restoring identical metadata, or impose a deadline on arbitrary filesystem I/O.

The published [fixtures](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/test/skill-metadata.test.ts) cover legacy/successor profiles, G04 unavailable identity and G07 malformed protected fields/root continuations, byte boundaries and overflow, UTF-8 and file evidence, descriptor cleanup, and inspection side-effect limits. B04 rewrites a same-inode/same-size file after a first returned chunk explicitly asserted to contain four bytes. It checks actual malformed-byte equality, changed timestamp, unknown/unreadable with preserved path and absent verification, bounded read/allocation, and exactly one inspected-descriptor close. The malformed-scalar case distinguishes stability rejection from parser missing. Invalid UTF-8 alone would also be unreadable if decoding were reached; the fixture does not instrument decoder invocation.

`metadata_only` reads body bytes but interprets no body instructions or references. It does not execute native/runtime commands, fetch sources, install/update, send, or authorize those operations. An explicitly requested `doctor --check-return-route` is a separate SSH probe. Fixture/source review does not demonstrate live message consumption or ACK.

## Review and release record

The [2026-10-09 design-only acceptance](https://github.com/abruption/session-peer-skill/blob/699a3251830c30c62d0f812363faf4d0eb0c8e0c/docs/typescript-compatibility.md) reviewed exact #126 `ba18bb806a6ba503381259b4255211af3adc0336` and #129 `bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c`. It accepted the finite profiles, parser/status envelopes, G07 correction, and reader fixtures without authorizing publication. The final published source clarifies and fixtures its two nonblocking plain-name-after-map and whitespace details without changing parser behavior.

The guard runtime was subsequently published before this successor skill was finalized. The user authorized this skill's versioned release. Its [separate release record](https://github.com/abruption/session-peer-skill/releases/tag/session-peer-ts-v0.2.0) records the final skill commit and content SHA-256. TS runtime guidance and PARITY can then adopt that same reviewed immutable skill pin in a separate runtime-repository change. Existing Python/reference pins remain independent. Runtime and skill adoption stay explicit manager-owned user choices; no postinstall, automatic deployment, PATH replacement, or global update is implied.
