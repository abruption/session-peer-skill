# session-peer 스킬

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer)를 사용해 로컬, SSH 또는 선택 기능인 페어링 기기 환경의 Claude Code, Codex, 실행 중인 Antigravity 세션을 찾고 메시지를 보내는 에이전트 스킬입니다.

이 저장소에는 에이전트용 지침만 들어 있습니다. `session-peer` 실행 프로그램은 별도로 설치해야 합니다.

## 사전 요구 사항

session-peer 0.9.1 이상을 설치하고 확인합니다.

```bash
pipx install session-peer
session-peer --version
```

uv, pip, POSIX 독립 실행형 설치 및 Windows 설치는 [session-peer 설치 안내](https://github.com/abruption/session-peer#installation-options)를 참고하세요. 업데이트할 때도 기존 패키지 관리자를 유지합니다.

스킬은 session-peer 0.9.1 이상에서 공통으로 사용할 수 있는 기본 명령을 안내합니다. `--allow-inactive-codex-home`과 `--relay-login`은 session-peer 1.0.0 이상에서만 사용할 수 있습니다. macOS·Linux 수신기 정책의 `codexBin`과 시도별 Relay 진단은 session-peer 1.0.1 이상이 필요합니다. 선택 기능인 페어링 기기 전송에는 `session-peer[relay]` extra(Unix, Python 3.11 이상)가 필요합니다.

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

특정 릴리스를 고정해 설치하려면 해당 태그를 사용합니다(예: `v0.3.1`).

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.3.1/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## 버전 메타데이터

`session-peer/SKILL.md`는 [Agent Skills 명세](https://agentskills.io/specification)의 frontmatter `metadata` 맵에 기계가 읽을 수 있는 버전 정보를 기록합니다.

| 키 | 의미 |
|---|---|
| `version` | 스킬 릴리스 버전이며 `vX.Y.Z` 태그와 일치합니다 |
| `runtime-min-version` | 스킬이 지원하는 최소 session-peer runtime 버전입니다 |
| `runtime-full-version` | 스킬이 안내하는 모든 옵션을 쓰는 데 필요한 runtime 버전입니다 |

도구는 이 값을 읽어 오래된 스킬이나 runtime을 알릴 수 있습니다. runtime 1.0.1 이상은 `skillUpdates`로 오래된 스킬을, `session-peer doctor`로 비호환 스킬을 알릴 수 있습니다. 스킬은 원래 설치에 사용한 관리자로 업데이트해야 하며, runtime 업그레이드는 별도 관리되는 스킬 파일을 갱신하지 않습니다.

## Codex 회신 대기

Codex는 큐로 메시지를 받으며, 진행 중인 턴이 끝난 뒤에야 메시지를 읽습니다. 그래서 스킬은 작업 중인 Codex 세션에서 회신이 없는 것을 정상 상태로 보고, 요청을 다시 보내거나 회신을 재촉하지 않습니다. 다음 단계가 회신에 달려 있으면 에이전트는 correlation token과 재개할 단계를 기록하고, 턴을 종료해 작업을 일시 중지합니다. 일치하는 회신을 받으면 기록한 단계부터 재개합니다. Codex 송신자도 자기 큐로 회신을 받으므로 다른 작업을 계속하면 회신 수신이 늦어집니다.

## 정본과 호환 사본

이 저장소의 `session-peer/SKILL.md`가 배포 정본입니다. session-peer 실행 프로그램 저장소에 남는 사본은 전환 기간용 호환 스냅샷입니다. CLI 명령과 전송 동작은 계속 [session-peer 저장소](https://github.com/abruption/session-peer)에서 관리합니다.

## 개발 검증

PR을 열기 전에 스킬 메타데이터, README 간 일관성, 스킬 탐색, 격리된 설치를 검증합니다. CI는 `.github/workflows/validate.yml`에 고정된 Skills CLI 버전을 사용합니다.

```bash
node scripts/validate-skill.mjs
npx -y skills@1.7.0 add . --list
home="$(mktemp -d)"
HOME="$home" npx -y skills@1.7.0 add . \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
cmp session-peer/SKILL.md "$home/.agents/skills/session-peer/SKILL.md"
cmp session-peer/SKILL.md "$home/.claude/skills/session-peer/SKILL.md"
```

## 릴리스 절차

1. `session-peer/SKILL.md`의 `metadata.version`과 README 4개 언어판의 고정 태그를 새 버전으로 바꿉니다. runtime 요구 사항이 바뀌면 `runtime-min-version`, `runtime-full-version`과 해당 본문 문구도 함께 갱신합니다.
2. `node scripts/validate-skill.mjs`를 실행한 뒤 변경을 병합합니다.
3. 병합 커밋에 `git tag -a vX.Y.Z -m 'session-peer skill vX.Y.Z'`로 태그를 만들어 push하고 GitHub Release를 게시합니다. 태그가 `metadata.version`과 다르면 CI가 실패합니다.
4. runtime 저장소의 호환 스냅샷을 동기화합니다. `session-peer/SKILL.md`를 [abruption/session-peer](https://github.com/abruption/session-peer)의 `skills/session-peer/SKILL.md`로 복사하고, `cmp`로 바이트 단위 일치를 확인한 뒤 그 저장소에 PR을 올립니다.

## 라이선스

MIT
