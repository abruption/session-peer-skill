# TypeScript 0.4 handoff documentation candidate

[Back to TS setup](typescript.md)

## Preparation checkpoint — 2026-10-17

This is a documentation and contract proposal, not published runtime support or
an installation guide. Public runtime 0.3.6 and the published TS skill 0.2.1
source `0f494cabd05901c03161dc91792dcf89f8e96631` remain separate and unchanged.
The current integrated release candidate is [PR #151 source `bfbadfa42513791899fc8d2b5441238bbe5b2c4e`](https://github.com/abruption/session-peer-ts/tree/bfbadfa42513791899fc8d2b5441238bbe5b2c4e),
compiled VERSION **0.4.0**, based on integrated main
[`be6adb26f844e7158362a8fcd6d379fbe8d46864`](https://github.com/abruption/session-peer-ts/commit/be6adb26f844e7158362a8fcd6d379fbe8d46864).
It is source-candidate evidence, not npm publication or skill installation approval.
The exact candidate [CLI help](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/help.ts),
[API](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/docs/api.md)
and [finite profile guard](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/skill-metadata.ts)
are the primary review basis. A banner, help probe, merge or passing CI alone
cannot prove actual runtime publication.

## Dated source history — 2026-10-17 / 2026-10-18

- Historical #109 `55daf83bd8ebe1cd6e67bb98259130213d1cac71` reported VERSION 0.3.5;
  intermediate #108 `aa4c4ff002638116174c305ed594b3919bc92b17` reported 0.3.6.
  These are earlier snapshots, not the current integrated candidate.
- #106 merged at `81d1aece70b414b6aef00641076bd2716f630f6e`; #107 at
  `1e788be6b02c414b3c7de5bbad37afc7e293c2ff`, introducing journal/continuity changes.
- #108 review head `564adb32c2d4c6def5388b654050299a8536dad6` became squash
  `d645a692f8e402dd224691410fa89be502e45383`.
- #109 review head `9e123cf9e3bfb07a0526215c9e797a0fb538be46` became squash/main
  `be6adb26f844e7158362a8fcd6d379fbe8d46864` before release preparation #151.

The dependency sequence has been integrated, but actual release publication and
exact-source/artifact verification remain separate. Earlier component/native
records do not qualify this documentation update as a new live test.

## Scope and permission

Use the candidate workflow only after separate implementation/release approval,
actual supporting runtime publication, approved skill publication, and the user's
explicit sending/ledger workflow. Do not initialize a ledger, generate receipt
authority, provision remote hosts, change installed packages or send test messages
as part of this document review. Metadata compatibility is not source/content
authentication, sending permission, successful consumption or ACK.

## Candidate operations

These are source-review examples with placeholders, not instructions to run them
now. Resolve one intended TS executable and inspect its exact version/help and
source qualification; do not import Python flags or switch implementations.

| Operation | Candidate path and boundary |
|---|---|
| Initialize | `session-peer handoff init --json` explicitly creates the private POSIX ledger; not a discovery prerequisite to run automatically |
| Prepare | `session-peer handoff prepare --to TARGET --message-file FILE --json` records a fresh ID and original target/body binding without native submission |
| Send once | `session-peer send --to TARGET --message-file FILE --correlation-id PREPARED_UUID --json` uses that binding; an ID is not a general retry key |
| Inspect | `session-peer handoff status --correlation-id PREPARED_UUID --json` reads retained evidence and never resubmits |
| Independent wait | `session-peer handoff wait --correlation-id PREPARED_UUID --wait-for delivered --wait-timeout 30 --json` adds a bounded observation operation over a retained qualified submitted intent; records its own ledger wait state without resubmitting |
| Manual confirmation | `session-peer handoff confirm --receipt - --json` reads a private, explicitly verified operator-confirmation record from stdin |
| Private token receipt | `session-peer ack --receipt - --json` requires qualified private producer/consumer bootstrap and binding; production automated bootstrap is not provided |

The message file must be owner-owned, regular, non-symlink UTF-8 with POSIX mode
0600. The ledger uses owner/private checks; Windows ledger/private ACL support is
not provided. Select `SESSION_PEER_HANDOFF_HOME` only as an explicit absolute
private ledger directory. Do not construct a receipt from an untrusted reply or
pretend to be a receipt producer. Receipt/confirmation input is bounded to 4096
bytes on private stdin; capabilities do not belong in argv, environment, public
output, or the tool's ordinary persistent records.

A delivered wait requires the original send to have enabled and qualified observation,
for example with `--observe-delivery`. A correlation-only send cannot gain that
qualification afterward. Retained wait records are ledger writes, not native
resubmissions.

`--request-ack` is best-effort metadata, not automatic ACK collection.
`send --wait-for acknowledged` requires evidence whose automated bootstrap is
unsupported, so it refuses **before native effect**. Do not present it as a way to
wait for a model to acknowledge a new send. A retained independently verified
operator confirmation can be queried/waited separately; it does not retroactively
rewrite an earlier terminal wait.

## Private journal and continuity — integrated candidate

The [integrated ledger](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/handoff-ledger.ts)
does not persist the message body or its raw SHA-256 payload digest in the private
journal. It stores the digest as AES-256-GCM ciphertext authenticated to the
ledger epoch and intent ID, using a separate owner-private mode 0600 `ledger.key`.
This limits payload guessing from the journal alone; it does not protect against
a same-user reader with access to both files. Target/status/wait metadata still
exists in the journal: do not call this whole-journal or message-body encryption.

Missing, changed, malformed or untrusted keys and old plaintext records leave
history unavailable and refuse further submission. Report the refusal; do not
regenerate keys, reinitialize the ledger, migrate records or replay intents
automatically. Explicit fresh initialization is separate from recovery of
existing history. Do not print or attach either private file.

[Prepared Claude continuity](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/send.ts)
uses a private registry/descriptor/socket metadata fingerprint, checked again
before effect. The fingerprint calculation does not read or persist registry
content; normal target discovery can still read bounded registry JSON. The
fingerprint does not prove native incarnation, model identity or a public
generation; public Claude generation remains `null`.
Do not export the private fingerprint as a public generation token or infer
Codex observation support from it.

Finish or stop the original wait by its operationId; a newer wait must not
replace its deadline/terminal outcome. A duplicate already committed confirmation
preserves the original ACK time/classification and does not rewrite the journal.
These APIs and integrated callers are reviewed at the fixed release candidate
above. Source/fixture review is not a combined runtime or native test performed
by this documentation task.

## Platform and transport qualification

| Route | Candidate support and limits |
|---|---|
| Local macOS arm64 Codex | Exact native 0.160.1 or 0.162.1, original saved thread/home/writer generation, default storage and an already-warm supported metadata store |
| Local POSIX ledger/manual confirmation | Explicit `operator_confirmed` record after binding/order/submission verification; not automatic collection or model authentication |
| POSIX SSH opt-in send/wait | Same exact reviewed TS version at both endpoints; explicitly initialized destination ledger, destination preparation without native message submission, one send with the original remaining budget |
| Local Linux native observation | Unsupported; ordinary queue/manual POSIX confirmation is separate, not observation qualification |
| Windows handoff/observation | Unsupported; do not infer support from ordinary Windows SSH |
| Original-sender SSH receipt collector | Not provided; local ledger operations are not an automatic remote forwarding protocol |

SSH bounded waiting is the `send --host DEST --wait-for delivered` path on a
qualified destination, not `handoff wait --host DEST`. Local status/wait/confirm/ack
do not take SSH transport options. Inspect retained destination evidence only
through a separately authorized destination-side operation. Do not bootstrap a
remote ledger or collector automatically. A single explicit correlation ID cannot
be shared across multiple hosts; prefer one destination for a review example.

Native queue bootstrap verifies its own actual opened SQLite storage under
managed policy. A storage refusal promises zero queue effect, not zero filesystem
activity: native bootstrap may create policy-selected state/cache files first.
The observer itself uses only the already-warm original store, with no migration,
warm-up/backfill, resume, model turn or wake.

The integrated [queue guards](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/app-server.ts)
check the owned queue process's reported native build against the selected exact
version, not only a separate version probe. They preserve executable realpath,
device/inode/size/mtime/ctime continuity and check positive remaining budget
before version and SQLite-FD probes. After durable effect fencing and the final
asynchronous original-owner check, they recheck executable identity and the owned
PID's opened SQLite paths/device/inode against canonical files. These checks
reject observable changes; they do not authenticate executable code, provide an
atomic filesystem snapshot or guarantee a wall-clock SLA.


## Evidence, budgets and uncertainty

Queue/posted/submitted, exact client-ID injection, turn completion and arbitrary
reply text are distinct evidence. None automatically creates a receipt ACK.
Native submission facts can remain queued/submitted with consumption unconfirmed
even when observation or waiting fails. `operator_confirmed` is an operator's
explicit attestation; `token_possession` would prove capability possession, not
person/model identity or task completion. Do not manufacture either from text,
queue disappearance, `From:` or a completed turn.

Each opt-in handoff send or independent wait has an original total budget: integer 1–60 seconds, default 30,
including five seconds reserved for cleanup. Budgets at or below five seconds
refuse before effect. These are not universal timeouts for init, prepare, status, confirm or receipt stdin.
SSH carries remaining durations rather than starting a new
30-second budget. Independent waits have distinct operation IDs/cutoffs and never
overwrite another process's pending wait or an earlier terminal result.

Required unsupported evidence refuses before effect. Best-effort may select the
legacy queue path only when qualification failed before any app-server attempt;
there is no fallback after a possible native write. Keep native retry false.
Timeout, SIGINT, missing/corrupt history or an unknown result never authorize
automatic resend, a new correlation ID, successor-writer adoption or fallback.
Reconcile the original intent and retained evidence instead.

## Bounded privacy claim

SQLite internally evaluates body-bearing `item_json` cells to project bounded
IDs/status. Body/error columns are not returned to JavaScript/IPC/output. This is
**not** a promise that body bytes are never accessed inside SQLite. The candidate
limits recent user rows to 256 and excludes cells over 256 KiB before JSON
extraction; temporary SQLite storage is memory-only. Read-only SQLite can still
participate in transient SHM read locks. Original writer/schema/inode checks must
remain valid; matching schema alone does not restore lost qualification.

No rollout/history/queue-list/full-notification API, new native metadata endpoint,
transcript polling, or resumed model turn is an observation substitute.

## Proposed skill/profile and rollout

The [complete successor file](candidates/session-peer-ts-0.3.0.md) and
[fixture proposal](candidates/typescript-0.4-profile.json) are review-only data,
deliberately not named `SKILL.md` so Skills CLI does not install/discover an extra
skill. Proposed skill **0.3.0**, minimum **0.1.0**, full coverage **0.4.0** received design-direction acceptance for the earlier candidate, but are not
a jointly frozen final contract or public runtime support. The exact row is
implemented in the unpublished source candidate only. Minimum retains the explicit ordinary CLI baseline; 0.4 optional
operations require their final version/help/platform prerequisites. Full is feature
coverage, not security currency, broad platform support or doctor acceptance.

The published 0.3.2/0.3.3/0.3.4/0.3.5/0.3.6 guards reject this proposed tuple. The fixed unpublished 0.4 candidate explicitly enumerates all three existing
profiles and this exact successor; no arithmetic or wildcard admits another
profile. That implemented candidate row is not public compatibility. Exact metadata,
finite runtime/profile cases, full bytes and expected envelopes must be agreed
with the TS maintainer before any guard or skill is finalized. Malformed/unknown
evidence is not silently promoted to compatible; `metadata_only` remains limited.

The earlier b8ff909 content/profile direction was accepted at design level;
the 38cc7be journal/continuity candidate then received content-direction and
reported candidate-validator acceptance. These renewed provenance/queue-guard
bytes require exact review again. Public 0.3.6
reader limits are grounded in [its exact guard source](https://github.com/abruption/session-peer-ts/blob/7ddded836ef79a7e3384a342ca7011c7abbe127c/src/skill-metadata.ts);
the unpublished [0.4 candidate reader](https://github.com/abruption/session-peer-ts/blob/bfbadfa42513791899fc8d2b5441238bbe5b2c4e/src/skill-metadata.ts)
uses the same bounded reader at compiled VERSION 0.4.0. Keep its source/default
fixture evidence separate from actual runtime publication and never append it
to a published-version list by inference.

Order: agree exact profile/content/fixtures → review the supporting guard →
actually publish the supporting runtime and verify exact source/artifact →
separately approve/finalize/publish the skill → adopt its same published immutable
pin in all four TS runtime guides/PARITY. No new tag, pin, runtime install,
postinstall or manager/PATH replacement is part of this proposal.

Deferred: [Linux observation #130](https://github.com/abruption/session-peer-ts/issues/130),
[Windows observation/private ACL #131](https://github.com/abruption/session-peer-ts/issues/131),
and [voluntary producer/authenticated collector #132](https://github.com/abruption/session-peer-ts/issues/132).
No full Python-runtime equivalence, automatic ACK, Side Session, steering, Relay,
MCP or general-purpose wait support is introduced here.
