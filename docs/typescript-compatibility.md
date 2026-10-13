# TypeScript skill compatibility

[Back to TS setup](typescript.md)

TS skill 0.2.0 uses the successor profile supported by the published npm runtimes 0.3.3, 0.3.4, and 0.3.5. Runtime 0.3.3 source: [`c0ed30273b9e9c0049df86ae3c38486a94289527`](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/src/skill-metadata.ts). The 0.3.3 npm artifact has SHA-256 `3469cda6a7b2c89d42ed2a250d2e7b5b774293fee090968a4b261e824be4c075`; its verified provenance identifies that source and [publication workflow run 37907833518](https://github.com/abruption/session-peer-ts/actions/runs/37907833518).

Published runtime 0.3.4 explicitly retains the same two reviewed profiles; source: [`afed4a5a8945012faf1b23d52cffecb70470a5b3`](https://github.com/abruption/session-peer-ts/blob/afed4a5a8945012faf1b23d52cffecb70470a5b3/src/skill-metadata.ts). Its [release record](https://github.com/abruption/session-peer-ts/releases/tag/v0.3.4) records the npm artifact SHA-256 `6c8cb114485e067ac3e7f5792de7febf3680cb14dcda6e2c67df6cab773ca03c` and [publication workflow run 38194048045](https://github.com/abruption/session-peer-ts/actions/runs/38194048045). These are separate publication records, not a new property of doctor.

Published runtime 0.3.5 adds the explicit finite profile for skill 0.2.1 while retaining 0.1.0 and 0.2.0; source: [`a2057940ba19056fcaaa5551a7820f7414bd3bfa`](https://github.com/abruption/session-peer-ts/blob/a2057940ba19056fcaaa5551a7820f7414bd3bfa/src/skill-metadata.ts). Its [release record](https://github.com/abruption/session-peer-ts/releases/tag/v0.3.5) identifies the published runtime; the npm tarball SHA-256 is `46f4a01f9570034fca49cfa5fad620f3f45b5f33b1a6714f29ea0a3c1e751ac0`, with registry integrity checked separately. This runtime publication does not publish the companion skill 0.2.1, which remains an unreleased preparation for human approval.

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
| Public `0.3.4` | `compatible` | `compatible` | Explicit finite legacy/successor row; same root-name, parser and bounded input requirements |
| Public `0.3.5` | `compatible` | `compatible` | Explicit finite row; also accepts the unreleased 0.2.1 profile as shown below |
| Unknown or future combination | No automatic guarantee | No automatic guarantee | Review the actual runtime and profile; no wildcard or arithmetic acceptance |

Compatible and incompatible structural results carry `verification: metadata_only`. This checks metadata structure/profile support; it does not verify source provenance, content SHA, installation integrity, freshness, CLI feature coverage, permission to send, consumption, or ACK. The npm provenance verification above is separate release evidence, not a property of doctor.

Runtime 0.3.3's pure validator rejects a valid but unreviewed runtime identity such as `0.3.4` as `incompatible / skill_contract_mismatch / metadata_only`. This describes the released 0.3.3 validator supplied with identity `0.3.4`, not the published 0.3.4 guard: 0.3.4 explicitly adds that reviewed runtime row. Use an explicitly reviewed runtime row (0.3.3, 0.3.4, or 0.3.5) for the published 0.2.0 successor doctor check; no other future identity is accepted by inference. An older CLI can meet the minimum while its doctor rejects this newer metadata profile; do not edit metadata to hide that result. Runtime adoption remains a user-authorized operation under the existing package manager.

## Unreleased skill 0.2.1 and published runtime 0.3.5

This worktree prepares TS skill `0.2.1` for human approval; it is not a published replacement for skill `0.2.0`. Runtime 0.3.5 has published its support for this profile, but the existing published skill release remains 0.2.0. Public runtimes 0.3.2, 0.3.3, and 0.3.4 reject the proposed 0.2.1 profile as `incompatible / skill_contract_mismatch / metadata_only`, even though its CLI minimum and coverage reference are unchanged.

| Proposed profile | Skill version | Implementation | CLI minimum | Full coverage reference | Policy |
|---|---|---|---|---|---|
| Draft successor revision | `0.2.1` | `typescript` | `0.1.0` | `0.3.2` | `probe-help` |

| Inspecting runtime | Legacy `0.1.0` | Published successor `0.2.0` | Draft successor `0.2.1` | Evidence scope |
|---|---|---|---|---|
| Public `0.3.2` | `compatible` | `incompatible` | `incompatible` | Published exact legacy tuple checker |
| Public `0.3.3` | `compatible` | `compatible` | `incompatible` | Published finite row |
| Public `0.3.4` | `compatible` | `compatible` | `incompatible` | Published finite row |
| Public `0.3.5` | `compatible` | `compatible` | `compatible` | Explicit published guard row; valid protected fields and healthy bounded input required; skill 0.2.1 itself remains unreleased |
| Unknown or future combination | No automatic guarantee | No automatic guarantee | No automatic guarantee | No wildcard or arithmetic acceptance |

The [published 0.3.5 design](https://github.com/abruption/session-peer-ts/blob/a2057940ba19056fcaaa5551a7820f7414bd3bfa/docs/design/typescript-skill-compatibility.md) and [metadata fixtures](https://github.com/abruption/session-peer-ts/blob/a2057940ba19056fcaaa5551a7820f7414bd3bfa/test/skill-metadata.test.ts) cover the three finite profiles using the compiled VERSION `0.3.5` helper default, explicit `undefined`, and outer `inspectSkill`. Static source and fixture review remains separate from executing those tests or proving live message consumption or ACK.

Historical review evidence: the 2026-10-13 Draft #144 review used exact source `08c507ca1c2a3805b189ee05bfdd32b0d3d2dacb`; its design document SHA-256 was `251ba89481297891eab480344d5df556fd0d0fb94a3451f4bb69f01bf5989761` and `src/skill-metadata.ts` SHA-256 was `bd396f92992fcd84f7cea3c690443cba28f4ee09069d2eccdbbcfd21f35bc3f2`. The companion candidate at `9db5420b45568dd08fc43d406dbf9ad1952f7891` contained a 13,930-byte SKILL with SHA-256 `96d5a0d049f8a4d193703af3583b198a91079d44ae373de34e94a54e2296a4d6`. These are dated candidate review records, not the current final skill bytes, a release record, or an installation pin.

The doctor requirement for the prepared skill 0.2.1 is the explicitly reviewed and published runtime 0.3.5 row, not the CLI minimum `0.1.0` or full coverage reference `0.3.2`. Optional operations still require the resolved executable's stable TypeScript version marker, affirmative help, and actual platform/native/security/permission prerequisites. Do not alter metadata to conceal an older doctor's rejection.

The supporting runtime publication gate is complete. Before skill 0.2.1 can be published, review the final complete skill bytes and finite profile and obtain separate approval to finalize and publish its metadata/content/immutable pin. The published skill installation pin remains `8482cf644507c682915e35c85aa3384c53864906` and its release tag remains `session-peer-ts-v0.2.0`. This preparation head is not an installation pin. Four-language runtime guidance and PARITY pin adoption follow the separately approved skill publication. Python skill/reference pins and 0.4 handoff designs remain independent. This document does not authorize installation, operations, merge, or publication.

## Minimum, full features, and guard acceptance

- `runtime-min-version` is the CLI compatibility floor for the explicitly documented baseline command path in the named implementation. A runtime below it is unsupported. It is not a latest-version marker, a security recommendation, or the minimum for every optional feature.
- `runtime-full-version` is this skill revision's coverage reference for the published CLI features it guides users to use. It does not guarantee every runtime feature, platform/native-agent version, remote provisioning, security patch level, permission, delivery, or ACK. Unsupported and future features do not count toward coverage.
- Between minimum and full, gate optional operations by their feature-specific version and affirmative help from the resolved TS executable. At or above full, actual platform/native prerequisites, allowlists, permissions, and unique-writer guards still apply. Help proves option presence only.
- Doctor acceptance is a separate finite runtime/profile contract. Meeting minimum/full numerically does not establish metadata compatibility, and `metadata_only` does not grant network access, installation, update, or send authority.

The independent Python contract remains skill 0.3.3, minimum 0.9.1, full 1.0.1, and the security patch recommendation documented in its own instructions. TS versioning does not change the Python canonical skill, compatibility snapshot, or runtime/reference/parity pins.

## Runtime 0.3.3 input and result contract

The same input/result contract applies to published 0.3.4 and 0.3.5, with the explicit additional runtime/profile rows shown above.

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

The outer inspection result preserves `path`. Absent verification means the property is omitted, not `null`. An omitted or explicitly `undefined` pure-helper runtime argument uses the inspecting runtime's compiled VERSION (0.3.3, 0.3.4, or 0.3.5) and is not an unavailable-identity fixture. Reader failures precede metadata verdicts. Canonicalization can wrap an earlier path error as `home_resolution_failed`, producing unknown/unreadable instead of the raw errno result; do not collapse all permission errors into unknown.

For historical comparison, public [0.3.2 source](https://github.com/abruption/session-peer-ts/blob/f335f07352c842f2f6ceb12bd2ca6274b52f69f7/src/diagnostics.ts) does not check root name and classifies missing/duplicate/regex-nonmatching required scalars in a single metadata section as incompatible. Its empty/absent frontmatter and zero/multiple maps are unknown. The 0.3.3 parser classification is an intentional change, not a restatement of the older checker.

## Reader bounds and evidence limits

Runtimes 0.3.3, 0.3.4, and 0.3.5 count **65,536 whole-file raw UTF-8 bytes**, including BOM, whitespace, line endings, and body. Read requests and allocation are capped at **65,537 bytes**, including one overflow-detection byte. Pre-read stat is an early check; fatal UTF-8 decoding follows bounded reading and stability checks.

The reader canonicalizes managed symlinks, verifies regular-file evidence on the opened descriptor, and compares device/inode/size/mtime/ctime and path/alias evidence around the read. Observable growth, truncation, replacement, alias changes, or same-size timestamp changes produce unknown/unreadable. Every opened descriptor is closed. These checks detect observed changes; they do not authenticate content, create an atomic snapshot, protect against a writer restoring identical metadata, or impose a deadline on arbitrary filesystem I/O.

The published [fixtures](https://github.com/abruption/session-peer-ts/blob/c0ed30273b9e9c0049df86ae3c38486a94289527/test/skill-metadata.test.ts) cover legacy/successor profiles, G04 unavailable identity and G07 malformed protected fields/root continuations, byte boundaries and overflow, UTF-8 and file evidence, descriptor cleanup, and inspection side-effect limits. B04 rewrites a same-inode/same-size file after a first returned chunk explicitly asserted to contain four bytes. It checks actual malformed-byte equality, changed timestamp, unknown/unreadable with preserved path and absent verification, bounded read/allocation, and exactly one inspected-descriptor close. The malformed-scalar case distinguishes stability rejection from parser missing. Invalid UTF-8 alone would also be unreadable if decoding were reached; the fixture does not instrument decoder invocation.

`metadata_only` reads body bytes but interprets no body instructions or references. It does not execute native/runtime commands, fetch sources, install/update, send, or authorize those operations. An explicitly requested `doctor --check-return-route` is a separate SSH probe. Fixture/source review does not demonstrate live message consumption or ACK.

## Review and release record

This historical section records the published skill 0.2.0 release. The 0.2.1
preparation and its remaining approval gates are described separately above.

The [2026-10-09 design-only acceptance](https://github.com/abruption/session-peer-skill/blob/699a3251830c30c62d0f812363faf4d0eb0c8e0c/docs/typescript-compatibility.md) reviewed exact #126 `ba18bb806a6ba503381259b4255211af3adc0336` and #129 `bfb3d6f1256ab076a76660e08a7bf1ad071a6c6c`. It accepted the finite profiles, parser/status envelopes, G07 correction, and reader fixtures without authorizing publication. The final published source clarifies and fixtures its two nonblocking plain-name-after-map and whitespace details without changing parser behavior.

The guard runtime was subsequently published before this successor skill was finalized. The user authorized this skill's versioned release. Its [separate release record](https://github.com/abruption/session-peer-skill/releases/tag/session-peer-ts-v0.2.0) records the final skill commit and content SHA-256. TS runtime guidance and PARITY can then adopt that same reviewed immutable skill pin in a separate runtime-repository change. Existing Python/reference pins remain independent. Runtime and skill adoption stay explicit manager-owned user choices; no postinstall, automatic deployment, PATH replacement, or global update is implied.
