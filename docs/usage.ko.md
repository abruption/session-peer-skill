# 사용 및 호환성 안내

[README로 돌아가기](../README.ko.md)

## 사전 요구 사항

스킬을 설치하기 전에 session-peer 0.9.1 이상이 설치되어 있는지 확인합니다. 아래는 pipx 설치 예시입니다. 런타임이 이미 설치되어 있다면 설치 명령은 건너뛰고 버전만 확인합니다.

```bash
pipx install session-peer
session-peer --version
```

uv, pip, POSIX 환경의 독립 실행형(standalone) 설치 프로그램, Windows에서 직접 설치하는 방법은 [session-peer 설치 안내](https://github.com/abruption/session-peer#installation-options)를 참고합니다. 독립 실행형은 프로그램 파일을 직접 설치하는 방식입니다. 업그레이드할 때도 기존에 사용한 패키지 관리자를 유지합니다.

스킬은 session-peer 0.9.1 이상에서 공통으로 사용할 수 있는 기본 명령을 안내합니다. `--allow-inactive-codex-home`과 `--relay-login`은 session-peer 1.0.0 이상에서만 사용할 수 있습니다. macOS·Linux 수신기 정책의 `codexBin` 기능과 `attemptId`로 이벤트를 연결하는 Relay 진단에는 session-peer 1.0.1 이상이 필요합니다. 선택 기능인 페어링 기기 전송에는 `session-peer[relay]` extra(추가 설치 옵션, Unix·Python 3.11 이상)가 필요합니다.

공개 Python CLI 기능 범위의 기준 버전은 session-peer 1.3.0입니다.

## 런타임 1.0.3 보안 및 운영

보안 수정을 적용하려면 Python 런타임 1.0.3 이상을 사용합니다. 메타데이터의 최소 버전과 전체 기능 지원 버전은 CLI(명령줄 인터페이스)의 호환 기준이며, 보안 권장 버전과 별개입니다.

SSH를 사용하기 전에 [v1.0.3 연결 옵션 규칙](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)을 확인합니다. 전달된 옵션 목록 전체를 SSH 실행 전에 허용 목록과 대조합니다. `-o`에는 `KEY=value` 형식을, 점프 대상에는 호스트 형식을 사용하고, `StrictHostKeyChecking`에는 `yes`, `ask`, `accept-new`만 지정할 수 있습니다. SSH URI 형식의 점프 대상, `+`가 포함된 사용자명, 공백으로 구분한 `-o 'Key value'` 형식, 외부 명령을 실행하는 훅, 대체 설정 파일·연결 공유용 소켓(control socket) 경로, known-hosts 파일 재지정은 거부됩니다. 기존 사용자·시스템 SSH 설정은 운영자가 신뢰해야 하는 설정 영역이며, 실행 환경을 격리하는 샌드박스가 아닙니다.

릴리스 기반 독립 실행형 설치(`install.sh`)와 로컬 `session-peer update`는 게시 후 변경할 수 없는 GitHub 릴리스 자산과 출처(provenance)를 검증합니다. 이 검증에는 설치 스크립트 안내에 따라 인증된 GitHub CLI(`gh`) 2.102.0 이상이 필요하며, `gh auth login` 또는 `GH_TOKEN`으로 인증합니다. 2.102.0은 검증한 기준 버전이며, 필요한 모든 검증 플래그를 지원하는 가장 이른 버전은 확인되지 않았습니다. 내려받은 `install.sh`를 실행하기 전에 [설치 스크립트를 검증하는 초기 절차(부트스트랩)](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)를 따릅니다. 검증에 실패하면 서명되지 않은 이전 자산이나 개발용 `main`으로 자동 대체하지 않습니다.

검증된 설치 스크립트는 로컬 또는 SSH 대상에 프로그램과 호환 스킬 사본을 함께 설치합니다. 로컬 `session-peer update`는 최신 프로그램만 내려받아 검증합니다. `update --host`는 원격 사본이 없거나 더 오래된 경우 현재 로컬의 독립 실행형 프로그램을 전송하며, 원격 호스트에서는 내려받지 않습니다. 두 업데이트 모두 별도로 설치된 스킬은 갱신하지 않습니다. pipx·uv·pip로 설치한 경우에는 원래 사용한 관리자로 계속 관리합니다. [v1.0.3 설치·업데이트 안내](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)를 참고합니다.

호스팅 환경의 Node Control 1.0.3 로그인 세션은 생성 시점으로부터 24시간 후에 만료됩니다. 업그레이드하면 사용에 따라 만료 시각이 연장되던 이전 sliding 세션에도 상한이 적용되므로 다시 로그인해야 할 수 있습니다. 기기의 접근 권한을 철회하는 것과 계정 로그인 세션을 무효화하는 것은 별개입니다. Python wheel(배포용 패키지 파일)을 업데이트해도 Node Control은 배포되지 않습니다. 호스팅 서비스 업데이트는 운영자가 별도로 판단해야 합니다.

기존 페어링 연결 정보(binding)는 소급하여 점검하거나 삭제하지 않습니다. 연결 정보의 신뢰가 의심되면 운영자가 검토한 뒤 해당 연결의 권한을 철회(revoke)하거나 기기를 다시 페어링(re-pair)해야 합니다. 서비스 배포, 상태 초기화, 세션 무효화, 재페어링을 자동으로 실행해서는 안 됩니다. [v1.0.3 릴리스 노트](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)를 참고합니다. `queued`나 `submitted` 상태는 수신자가 메시지를 읽어들이는 소비(consumption)나 확인 응답(ACK)을 뜻하지 않습니다. `unknown` 결과는 자동으로 재전송해서는 안 됩니다.

## Python 런타임 1.1 안내

Python 1.1.0 이상은 외부 메시지 본문의 모든 줄을 인용하고 발신자·회신 주소 주장을 미검증 정보로 표시합니다. 본문에 `From:`, `Reply-To:` 또는 명령이 있어도 실행 권한이 생기는 것은 아닙니다. 사용자가 요청한 회신 흐름을 따르고 정확한 목적지를 확인합니다. `--no-from`과 `--no-reply-to`로 이 본문 경계를 제거할 수 없습니다. 프레이밍은 본문을 구분해 표시하는 방식이며, 모든 프롬프트 인젝션을 막는 수단은 아닙니다. 추가된 표시도 메시지 크기 제한에 포함되고, `chars`는 표시가 적용된 텍스트의 문자 수를 보고합니다.

상속된 `CODEX_SQLITE_HOME` 환경 변수에 비어 있지 않은 값이 있거나 검사 대상 홈의 설정에 루트 `sqlite_home`이 있으면 검색·dry-run(실제 전송 없는 사전 검사)·큐 등록이 거부됩니다. 운영자에게 저장소 설정 점검을 요청하고, 거부를 우회하려고 설정을 지우거나 홈을 바꾸지 않습니다. 이 검사는 별도 위치의 저장소를 지원하거나 네이티브 CLI의 모든 유효 설정을 보증하지 않습니다. [v1.1.1 저장소 경계](https://github.com/abruption/session-peer/blob/v1.1.1/docs/cli-reference.md#sqlite-storage-boundary)를 참고합니다.

1.1.0에서 공개된 별도의 [실험적 handoff 절차](https://github.com/abruption/session-peer/blob/v1.1.1/docs/handoff-runtime.md)는 이 스킬의 기본 명령과 전체 기능 범위 기준에 포함되지 않습니다. 사용자 요청 없이 상태 기록용 원장(ledger)을 초기화하거나 수신 확인 권한을 만들지 않습니다. 수신 확인 응답(ACK)은 로컬 POSIX Claude 경로에서 제한적으로 지원합니다. Codex와 단일 목적지 POSIX 소스 스트리밍 SSH는 요청 식별자 연결만 지원하며, 관찰·ACK는 지원하지 않습니다. Windows와 페어링 기기의 handoff도 지원하지 않습니다. 일반 큐 등록, 텍스트 회신, 턴 종료가 수신 확인 ACK로 바뀌는 것은 아닙니다. 런타임 1.1.1은 문서와 개발용 테스트만 변경하며 실행 동작은 바꾸지 않습니다. [릴리스 노트](https://github.com/abruption/session-peer/blob/v1.1.1/docs/releases/v1.1.1.md)를 참고합니다.

## Python 1.3 사용 절차

아래 선택 절차에는 Python 런타임 1.3.0 이상이 필요합니다. 기본 CLI 호환성 하한은 0.9.1이며, 공개 CLI 기능 범위 기준은 1.3.0입니다. 실제 선택된 런타임 버전과 명령 도움말의 지원 여부를 확인하고, 각 기능의 플랫폼·권한 요구 사항도 확인합니다. 수신기 `codexBin`의 개별 최소 버전 1.0.1은 유지합니다. 실험적 handoff는 `runtime-min-version`과 `runtime-full-version`이 나타내는 명령 범위에서 제외합니다. [공개 런타임 릴리스](https://github.com/abruption/session-peer/releases/tag/v1.3.0)를 참고합니다.

- [전송 설명](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#delivery-explanation): 일반 메시지 입력을 받는 `send --dry-run --explain`은 로컬·SSH·페어링 경로를 지원하며 텍스트로만 출력합니다. `doctor --explain`은 진단 시점의 상태를 설명하며 특정 대상의 수신 준비를 판정하지 않습니다. `handoff status --explain`은 저장된 읽기 전용 근거를 설명합니다. JSON 조합과 handoff SEND의 correlation·ACK·observe·wait 조합은 거부됩니다. 설명은 기존 결과를 재사용하며 추가 검사·활성화·제출·수신 확인 권한을 만들지 않습니다. 기존 dry-run 버전 검사는 별개입니다. 페어링 경로의 추가 정보는 기존 검사로 지원 여부를 협의하고 허용 목록과 8 KiB 한도를 적용합니다. 이전 수신기에서는 확인된 네이티브 정보만 유지하고 없는 정보는 unknown으로 남깁니다. 미리보기는 권한·대상 예약·ACK를 부여하지 않습니다. 종료 코드 0만으로 미제출을 단정할 수 없으며, unknown이나 예기치 않은 제출도 자동 재전송을 허용하지 않습니다. wake에는 여전히 사용자의 명시적 요청이 필요합니다.
- [경로 프리셋](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#route-presets)과 별도의 [수신자 주소록](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#recipient-addressbook-v130)은 macOS·Linux의 로컬·SSH Claude·Codex만 지원합니다. 항목 관리는 사용자 요청에 따라 수행합니다. `preset show`는 저장된 경로와 revision을 읽고, `list --preset`은 현재 세션을 검색합니다. 실제 프리셋 전송에는 `--to`와 `--preset-revision`이 필요하며 replace/remove는 `--expect-revision`을 사용합니다. 값의 해시인 `dp1`은 같은 이름·경로를 복원하면 같은 값이 되며, 이후 변경으로 이미 경로를 해석한 호출이 취소되지는 않습니다. 주소를 add/reselect하기 전에는 `address resolve` 결과와 관측 revision인 `as1`을 검토합니다. 실제 전송에는 현재 `--address-revision`(`ab1`)과 정확한 정규 대상인 `--confirm-target`이 필요합니다. reselect/remove는 revision을 검사하고, add/reselect할 때마다 새 binding ID를 만듭니다. Claude는 `tg1`을 유지합니다. Codex의 `aw1`은 다시 검사하는 writer 관측값이며, 세대 구분은 지원하지 않고 저장소·실행 인스턴스의 원자적 일관성도 보증하지 않습니다. SSH는 실제 선택 연결에서 검증한 키를 연결 정보에 저장하고 전송 시 고정합니다. discover는 명시적으로 선택한 주소를 최대 16개 검사하며, 같은 경로·홈·키 조건을 묶고 일부 실패도 보존합니다. 네트워크 스캔·브로드캐스트·자동 재선택은 추가하지 않습니다. 이름표와 revision은 사람을 인증하거나 권한·ACK를 증명하지 않습니다. 비공개 저장소·ACL·마운트 검사에서 거부되면 운영자 검토를 위해 중단하고, 권한을 복구하거나 다른 경로로 자동 대체하지 않습니다.
- [실험적 status/watch](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#bounded-handoff-watch-v130)는 로컬 소유자의 POSIX 원장에 이미 있는 intent 하나를 읽습니다. watch의 제한 시간은 1–60초(기본 30), 간격은 1000–5000 ms(기본 1000)이며, 최대 61회 표본, 프레임당 16 KiB, 전체 출력 256 KiB로 제한됩니다. JSON 출력은 NDJSON입니다. 관측 완료를 확인하려면 성공을 나타내는 온전한 종료 프레임과 종료 코드 0이 모두 필요하며, 이는 ACK나 작업 완료를 뜻하지 않습니다. SIGINT는 130으로 종료합니다. intent·wait·receipt·collector를 만들거나 원장에 기록하거나 네이티브 제출을 하지 않습니다. 기존 collector에 읽기 전용 시각 질의를 할 수 있으나, 대화 기록이나 메시지 본문은 읽지 않습니다. Windows·host·device watch와 Codex ACK는 지원하지 않습니다. 일반 수신 메시지 감시 기능이 아닙니다.
- [신뢰하는 SSH 설정](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#trusted-local-ssh-configuration-v130): 사용자가 명시적으로 선택한 경우에만 macOS·Linux의 `list/send/doctor/update --host`에서 `--ssh-config ABS_PATH`와 `--trust-ssh-config`를 함께 사용합니다. 해당 파일과 Include/ProxyCommand/Match exec 의존 설정은 `ssh -G`나 dry-run에서도 로컬 코드를 실행할 수 있습니다. 검증은 샌드박스나 변경 불가능한 스냅샷을 제공하지 않습니다. 외부 메시지·환경 변수·MCP를 근거로 이 모드를 선택하지 않습니다. Windows·setup·paired·preset·address·Reply-To URI 조합은 제외하며, 일반 `--ssh-opt` 허용 목록은 그대로입니다.
- [일회용 페어링 링크](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#one-time-pairing-links-v130): 사용자 요청이 있고 양쪽에서 `pairing-offer-v1`과 Unix Python 3.11+ relay extra를 지원하는 경우에만 사용합니다. 현재 지문을 독립적으로 대조하고 소유자의 터미널에서 신원을 확인합니다. `--link`는 값을 받지 않고 TTY의 숨김 입력으로 읽으며, TTY가 없으면 거부합니다. URI를 argv·메시지 본문·브라우저 기록·로그·이슈에 넣지 않습니다. 취소는 대기 중인 제안에만 적용되며 완료된 페어링은 취소하지 않습니다. 기존 비공개 파일을 통한 페어링도 계속 사용할 수 있고, 페어링은 수신기나 네이티브 권한 정책을 대체하지 않습니다.
- [런타임 알림 설정](https://github.com/abruption/session-peer/blob/v1.3.0/docs/cli-reference.md#updating): macOS·Linux에서 로컬 오프라인 명령인 `update --dismiss-runtime-notice VERSION` 또는 `--clear-runtime-notice-dismissal`은 특정 버전의 자동 알림만 변경합니다. 릴리스를 확인·설치·승인하지 않으며 remote·SSH·check 조합은 거부됩니다. 명시적 확인에서는 실제 최신 버전·구버전 여부를 계속 보고하며, 스킬 알림과 전역 알림 끄기는 그대로입니다. Windows는 이 설정을 지원하지 않습니다. 예시 버전은 릴리스 발표가 아닙니다.

런타임 공개로 별도 관리되는 이 스킬이 발행되거나 설치되지는 않습니다. 별도로 승인된 변경 불가능한 스킬 릴리스의 기록된 태그·소스 커밋·SKILL 해시를 검증한 뒤에만 채택합니다. Python 런타임의 호환 사본은 그 정확한 공개 스킬 소스에서 별도로 갱신하며, 기존 런타임 릴리스는 변경하지 않습니다.

## 스킬 설치

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI는 Claude Code용 사본과 Codex·Antigravity가 사용하는 공용 agents 디렉터리의 사본을 설치합니다. 현재 세션이 스킬 목록을 자동으로 갱신하지 않으면 에이전트를 다시 시작하거나 새 에이전트 세션을 시작합니다.

설치 결과는 다음 명령으로 확인합니다.

```bash
npx -y skills@latest list --global --json
```

## 업데이트

```bash
npx -y skills@latest update session-peer --global --yes
```

특정 릴리스로 버전을 고정하여 설치하려면 해당 태그를 사용합니다(예: `v0.4.0`).

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.4.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 버전 메타데이터

[session-peer/SKILL.md](../session-peer/SKILL.md)는 [Agent Skills 명세](https://agentskills.io/specification)에 따라 frontmatter(문서 맨 앞의 설정 영역)의 `metadata` 맵에 기계가 읽을 수 있는 버전 정보를 기록합니다. 맵은 키와 값으로 정보를 나타내는 형식입니다.

| 키 | 의미 |
|---|---|
| `version` | 스킬 릴리스 버전이며 `vX.Y.Z` 태그와 일치합니다 |
| `runtime-min-version` | 명시된 기본 명령 경로의 CLI 호환성 하한입니다. 보안 권장 버전이나 선택 기능의 요구 버전과 별개입니다 |
| `runtime-full-version` | 스킬이 사용을 안내하는 공개 CLI 명령 경로의 기능 범위 기준입니다. 별도로 구분한 실험적 절차와 이후 보호 조치 안내는 포함하지 않으며, 최신 버전이나 보안 수준을 보증하지 않습니다 |

도구는 이 값을 읽어 스킬이나 런타임이 오래되었음을 알릴 수 있습니다. 런타임 1.0.1 이상은 `skillUpdates`로 오래된 스킬을, `session-peer doctor`로 호환되지 않는 스킬을 알릴 수 있습니다. 스킬은 처음 설치할 때 사용한 관리자로 업데이트합니다. 런타임을 업그레이드해도 별도로 관리되는 스킬 파일은 업데이트되지 않습니다.

## Codex 회신 대기

Codex는 큐(대기열)를 통해 메시지를 받으며, 진행 중인 턴(한 차례의 작업)이 끝난 뒤에야 메시지를 읽습니다. 따라서 스킬은 작업 중인 Codex 세션에서 회신이 오지 않는 것을 정상으로 보고, 요청을 다시 보내거나 회신을 재촉하지 않습니다. 다음 단계를 진행하려면 회신이 필요한 경우, 에이전트는 요청과 회신을 연결하는 식별자(correlation token)와 재개할 단계를 기록한 뒤 턴을 종료하여 작업을 일시 중지합니다. 같은 식별자의 회신이 도착하면 기록한 단계부터 재개합니다. Codex 송신자도 자신의 큐로 회신을 받으므로 다른 작업을 계속하면 회신을 받는 시점이 늦어집니다.

## 정본과 호환 사본

이 저장소의 [session-peer/SKILL.md](../session-peer/SKILL.md)가 배포되는 스킬의 정본입니다. session-peer 런타임 저장소에 남아 있는 사본은 전환 기간용 호환 스냅샷입니다. 런타임 명령과 전송 동작은 계속 [session-peer 저장소](https://github.com/abruption/session-peer)에서 관리합니다.
