# 사용 및 호환성 안내

[README로 돌아가기](../README.ko.md)

## 사전 요구 사항

session-peer 0.9.1 이상을 설치하고 확인합니다.

```bash
pipx install session-peer
session-peer --version
```

uv, pip, POSIX 독립 실행형 설치 및 Windows 설치는 [session-peer 설치 안내](https://github.com/abruption/session-peer#installation-options)를 참고하세요. 업데이트할 때도 기존 패키지 관리자를 유지합니다.

스킬은 session-peer 0.9.1 이상에서 공통으로 사용할 수 있는 기본 명령을 안내합니다. `--allow-inactive-codex-home`과 `--relay-login`은 session-peer 1.0.0 이상에서만 사용할 수 있습니다. macOS·Linux 수신기 정책의 `codexBin`과 시도별 Relay 진단은 session-peer 1.0.1 이상이 필요합니다. 선택 기능인 페어링 기기 전송에는 `session-peer[relay]` extra(Unix, Python 3.11 이상)가 필요합니다.

## 런타임 1.0.3 보안 및 운영

보안 수정을 위해 Python 런타임 1.0.3 이상을 권장합니다. 메타데이터의 최소·전체 버전은 CLI 호환 기준이며 보안 권장 버전이 아닙니다. SSH 사용 전 [v1.0.3 연결 옵션 규칙](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#limits)을 확인하세요. 전달된 옵션 전체를 SSH 실행 전에 허용 목록으로 검증합니다. `-o`에는 `KEY=value`, 점프 대상에는 호스트 형식을 사용하고 `StrictHostKeyChecking`은 `yes`, `ask`, `accept-new`만 지정하세요. SSH URI 점프 대상, `+`가 포함된 사용자명, 공백형 `-o 'Key value'`, 명령 훅, 대체 설정·control socket 경로, known-hosts 파일 재지정은 거부됩니다. 기존 사용자·시스템 SSH 설정은 운영자가 신뢰해야 하는 경계이며 sandbox가 아닙니다.

릴리스 기반 독립 실행형 설치와 로컬 업데이트에는 불변 릴리스 자산과 출처 검증, 인증된 최신 GitHub CLI(`gh`; 2.102.0으로 검증)가 필요합니다. 내려받은 `install.sh` 실행 전 [검증된 설치 스크립트 부트스트랩](https://github.com/abruption/session-peer/blob/v1.0.3/RELEASING.md)을 따르세요. 검증에 실패하면 서명되지 않은 과거 자산이나 개발용 `main`으로 자동 전환하지 않습니다. 검증된 설치 스크립트는 로컬 또는 SSH 대상에 프로그램과 호환 스킬 사본을 함께 설치합니다. 로컬 `session-peer update`는 최신 프로그램만 내려받아 검증하고, `update --host`는 원격 사본이 없거나 더 오래된 경우 현재 로컬 독립 실행형 프로그램을 전송하며 원격에서 내려받지 않습니다. 둘 다 별도 설치된 스킬은 갱신하지 않습니다. pipx·uv·pip 설치는 기존 관리자로 업데이트하세요. [v1.0.3 설치·업데이트 안내](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md#updating)를 참고하세요.

호스팅된 Node Control 1.0.3 로그인 세션은 생성 후 24시간에 만료됩니다. 업그레이드 시 이전 sliding 세션도 상한이 적용되어 재로그인이 필요할 수 있습니다. 기기 폐기와 계정 로그인 세션 폐기는 별개입니다. Python wheel 업데이트만으로 Node Control이 배포되지 않으며, 운영자가 호스팅 서비스 업데이트를 별도로 판단해야 합니다. 기존 페어링 binding은 소급 감사·삭제되지 않으므로 신뢰가 의심되면 운영자가 검토하고 revoke 또는 re-pair해야 합니다. 서비스 배포·상태 초기화·세션 폐기·재페어링을 자동 실행하지 마세요. [v1.0.3 릴리스 노트](https://github.com/abruption/session-peer/blob/v1.0.3/docs/releases/v1.0.3.md)를 참고하세요. `queued`나 `submitted`는 소비 또는 ACK가 아니며, `unknown` 결과를 자동 재전송하지 마세요.

## 스킬 설치

```bash
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

Skills CLI는 Claude Code용 사본과 Codex·Antigravity가 사용하는 공용 agents 디렉터리의 사본을 설치합니다. 현재 에이전트가 스킬 목록을 자동 갱신하지 않으면 새 세션을 시작하세요.

설치 결과는 다음 명령으로 확인합니다.

```bash
npx -y skills@latest list --global --json
```

## 업데이트

```bash
npx -y skills@latest update session-peer --global --yes
```

특정 릴리스를 고정해 설치하려면 해당 태그를 사용합니다(예: `v0.3.2`).

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.2/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 버전 메타데이터

[session-peer/SKILL.md](../session-peer/SKILL.md)는 [Agent Skills 명세](https://agentskills.io/specification)의 frontmatter `metadata` 맵에 기계가 읽을 수 있는 버전 정보를 기록합니다.

| 키 | 의미 |
|---|---|
| `version` | 스킬 릴리스 버전이며 `vX.Y.Z` 태그와 일치합니다 |
| `runtime-min-version` | 스킬이 지원하는 최소 session-peer runtime 버전입니다 |
| `runtime-full-version` | 스킬이 안내하는 모든 옵션을 쓰는 데 필요한 runtime 버전입니다 |

도구는 이 값을 읽어 오래된 스킬이나 runtime을 알릴 수 있습니다. runtime 1.0.1 이상은 `skillUpdates`로 오래된 스킬을, `session-peer doctor`로 비호환 스킬을 알릴 수 있습니다. 스킬은 원래 설치에 사용한 관리자로 업데이트해야 하며, runtime 업그레이드는 별도 관리되는 스킬 파일을 갱신하지 않습니다.

## Codex 회신 대기

Codex는 큐로 메시지를 받으며, 진행 중인 턴이 끝난 뒤에야 메시지를 읽습니다. 그래서 스킬은 작업 중인 Codex 세션에서 회신이 없는 것을 정상 상태로 보고, 요청을 다시 보내거나 회신을 재촉하지 않습니다. 다음 단계가 회신에 달려 있으면 에이전트는 correlation token과 재개할 단계를 기록하고, 턴을 종료해 작업을 일시 중지합니다. 일치하는 회신을 받으면 기록한 단계부터 재개합니다. Codex 송신자도 자기 큐로 회신을 받으므로 다른 작업을 계속하면 회신 수신이 늦어집니다.

## 정본과 호환 사본

이 저장소의 [session-peer/SKILL.md](../session-peer/SKILL.md)가 배포 정본입니다. session-peer 실행 프로그램 저장소에 남는 사본은 전환 기간용 호환 스냅샷입니다. CLI 명령과 전송 동작은 계속 [session-peer 저장소](https://github.com/abruption/session-peer)에서 관리합니다.
