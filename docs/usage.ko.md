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

## 런타임 1.0.3 보안 및 운영

보안 수정을 적용하려면 Python 런타임 1.0.3 이상을 사용합니다. 메타데이터의 최소 버전과 전체 기능 지원 버전은 CLI(명령줄 인터페이스)의 호환 기준이며, 보안 권장 버전과 별개입니다.

SSH를 사용하기 전에 [v1.0.3 연결 옵션 규칙](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)을 확인합니다. 전달된 옵션 목록 전체를 SSH 실행 전에 허용 목록과 대조합니다. `-o`에는 `KEY=value` 형식을, 점프 대상에는 호스트 형식을 사용하고, `StrictHostKeyChecking`에는 `yes`, `ask`, `accept-new`만 지정할 수 있습니다. SSH URI 형식의 점프 대상, `+`가 포함된 사용자명, 공백으로 구분한 `-o 'Key value'` 형식, 외부 명령을 실행하는 훅, 대체 설정 파일·연결 공유용 소켓(control socket) 경로, known-hosts 파일 재지정은 거부됩니다. 기존 사용자·시스템 SSH 설정은 운영자가 신뢰해야 하는 설정 영역이며, 실행 환경을 격리하는 샌드박스가 아닙니다.

릴리스 기반 독립 실행형 설치(`install.sh`)와 로컬 `session-peer update`는 게시 후 변경할 수 없는 GitHub 릴리스 자산과 출처(provenance)를 검증합니다. 이 검증에는 설치 스크립트 안내에 따라 인증된 GitHub CLI(`gh`) 2.102.0 이상이 필요하며, `gh auth login` 또는 `GH_TOKEN`으로 인증합니다. 2.102.0은 검증한 기준 버전이며, 필요한 모든 검증 플래그를 지원하는 가장 이른 버전은 확인되지 않았습니다. 내려받은 `install.sh`를 실행하기 전에 [설치 스크립트를 검증하는 초기 절차(부트스트랩)](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)를 따릅니다. 검증에 실패하면 서명되지 않은 이전 자산이나 개발용 `main`으로 자동 대체하지 않습니다.

검증된 설치 스크립트는 로컬 또는 SSH 대상에 프로그램과 호환 스킬 사본을 함께 설치합니다. 로컬 `session-peer update`는 최신 프로그램만 내려받아 검증합니다. `update --host`는 원격 사본이 없거나 더 오래된 경우 현재 로컬의 독립 실행형 프로그램을 전송하며, 원격 호스트에서는 내려받지 않습니다. 두 업데이트 모두 별도로 설치된 스킬은 갱신하지 않습니다. pipx·uv·pip로 설치한 경우에는 원래 사용한 관리자로 계속 관리합니다. [v1.0.3 설치·업데이트 안내](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)를 참고합니다.

호스팅 환경의 Node Control 1.0.3 로그인 세션은 생성 시점으로부터 24시간 후에 만료됩니다. 업그레이드하면 사용에 따라 만료 시각이 연장되던 이전 sliding 세션에도 상한이 적용되므로 다시 로그인해야 할 수 있습니다. 기기의 접근 권한을 철회하는 것과 계정 로그인 세션을 무효화하는 것은 별개입니다. Python wheel(배포용 패키지 파일)을 업데이트해도 Node Control은 배포되지 않습니다. 호스팅 서비스 업데이트는 운영자가 별도로 판단해야 합니다.

기존 페어링 연결 정보(binding)는 소급하여 점검하거나 삭제하지 않습니다. 연결 정보의 신뢰가 의심되면 운영자가 검토한 뒤 해당 연결의 권한을 철회(revoke)하거나 기기를 다시 페어링(re-pair)해야 합니다. 서비스 배포, 상태 초기화, 세션 무효화, 재페어링을 자동으로 실행해서는 안 됩니다. [v1.0.3 릴리스 노트](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)를 참고합니다. `queued`나 `submitted` 상태는 수신자가 메시지를 읽어들이는 소비(consumption)나 확인 응답(ACK)을 뜻하지 않습니다. `unknown` 결과는 자동으로 재전송해서는 안 됩니다.

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

특정 릴리스로 버전을 고정하여 설치하려면 해당 태그를 사용합니다(예: `v0.3.3`).

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.3/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 버전 메타데이터

[session-peer/SKILL.md](../session-peer/SKILL.md)는 [Agent Skills 명세](https://agentskills.io/specification)에 따라 frontmatter(문서 맨 앞의 설정 영역)의 `metadata` 맵에 기계가 읽을 수 있는 버전 정보를 기록합니다. 맵은 키와 값으로 정보를 나타내는 형식입니다.

| 키 | 의미 |
|---|---|
| `version` | 스킬 릴리스 버전이며 `vX.Y.Z` 태그와 일치합니다 |
| `runtime-min-version` | 스킬이 지원하는 최소 session-peer 런타임 버전입니다 |
| `runtime-full-version` | 스킬이 안내하는 모든 옵션을 사용하는 데 필요한 런타임 버전입니다 |

도구는 이 값을 읽어 스킬이나 런타임이 오래되었음을 알릴 수 있습니다. 런타임 1.0.1 이상은 `skillUpdates`로 오래된 스킬을, `session-peer doctor`로 호환되지 않는 스킬을 알릴 수 있습니다. 스킬은 처음 설치할 때 사용한 관리자로 업데이트합니다. 런타임을 업그레이드해도 별도로 관리되는 스킬 파일은 업데이트되지 않습니다.

## Codex 회신 대기

Codex는 큐(대기열)를 통해 메시지를 받으며, 진행 중인 턴(한 차례의 작업)이 끝난 뒤에야 메시지를 읽습니다. 따라서 스킬은 작업 중인 Codex 세션에서 회신이 오지 않는 것을 정상으로 보고, 요청을 다시 보내거나 회신을 재촉하지 않습니다. 다음 단계를 진행하려면 회신이 필요한 경우, 에이전트는 요청과 회신을 연결하는 식별자(correlation token)와 재개할 단계를 기록한 뒤 턴을 종료하여 작업을 일시 중지합니다. 같은 식별자의 회신이 도착하면 기록한 단계부터 재개합니다. Codex 송신자도 자신의 큐로 회신을 받으므로 다른 작업을 계속하면 회신을 받는 시점이 늦어집니다.

## 정본과 호환 사본

이 저장소의 [session-peer/SKILL.md](../session-peer/SKILL.md)가 배포되는 스킬의 정본입니다. session-peer 런타임 저장소에 남아 있는 사본은 전환 기간용 호환 스냅샷입니다. 런타임 명령과 전송 동작은 계속 [session-peer 저장소](https://github.com/abruption/session-peer)에서 관리합니다.
