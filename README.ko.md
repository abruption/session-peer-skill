# session-peer 스킬

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer)를 사용해 로컬 또는 SSH 환경의 Claude Code, Codex, 실행 중인 Antigravity 세션을 찾고 메시지를 보내는 에이전트 스킬입니다.

이 저장소에는 에이전트용 지침만 들어 있습니다. `session-peer` 실행 프로그램은 별도로 설치해야 합니다.

## 사전 요구 사항

session-peer 0.9.1 이상을 설치하고 확인합니다.

```bash
pipx install session-peer
session-peer --version
```

uv, pip, POSIX 독립 실행형 설치 및 Windows 설치는 [session-peer 설치 안내](https://github.com/abruption/session-peer#installation-options)를 참고하세요. 업데이트할 때도 기존 패키지 관리자를 유지합니다.

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

최초 릴리스와 정확히 같은 내용을 설치하려면 `v0.1.0` 태그를 사용합니다.

```bash
npx -y skills@latest add \
  https://github.com/abruption/session-peer-skill/tree/v0.1.0/session-peer \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
```

## Codex 회신 대기

Codex는 큐로 메시지를 받으며, 진행 중인 턴이 끝난 뒤에야 메시지를 읽습니다. 그래서 스킬은 작업 중인 Codex 세션에서 회신이 없는 것을 정상 상태로 보고, 요청을 다시 보내거나 회신을 재촉하지 않습니다. 다음 단계가 회신에 달려 있으면 에이전트는 correlation token과 재개할 단계를 기록하고, 턴을 종료해 작업을 일시 중지합니다. 일치하는 회신을 받으면 기록한 단계부터 재개합니다. Codex 송신자도 자기 큐로 회신을 받으므로 다른 작업을 계속하면 회신 수신이 늦어집니다.

## 정본과 호환 사본

이 저장소의 `session-peer/SKILL.md`가 배포 정본입니다. session-peer 실행 프로그램 저장소에 남는 사본은 전환 기간용 호환 스냅샷입니다. CLI 명령과 전송 동작은 계속 [session-peer 저장소](https://github.com/abruption/session-peer)에서 관리합니다.

## 개발 검증

```bash
npx -y skills@latest add . --list
home="$(mktemp -d)"
HOME="$home" npx -y skills@latest add . \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
cmp session-peer/SKILL.md "$home/.agents/skills/session-peer/SKILL.md"
cmp session-peer/SKILL.md "$home/.claude/skills/session-peer/SKILL.md"
```

## 라이선스

MIT
