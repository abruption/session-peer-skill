# session-peer 스킬

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer)를 사용해 로컬, SSH 또는 선택 기능인 페어링 기기 환경의 Claude Code, Codex, 실행 중인 Antigravity 세션을 찾고 메시지를 보내는 에이전트 스킬입니다.

## 데모

![Claude Code와 Codex 사이에 메시지를 주고받는 session-peer 런타임](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

런타임 데모는 Claude Code와 Codex의 메시지 전송을 보여 줍니다. 스킬은 에이전트용 지침을 제공합니다.

## 빠른 시작

session-peer 0.9.1 이상이 필요하며, 안내하는 모든 기능에는 session-peer 1.0.1 이상이 필요합니다. 선택형 페어링 기기 전송에는 Unix와 Python 3.11 이상 및 `session-peer[relay]`가 필요합니다.
v1.0.3 보안 수정이 적용된 Python 런타임 1.0.3 이상을 권장합니다. 앞의 호환 버전은 CLI 기능 기준이며 보안 권장 버전과 별개입니다.

### 설치

런타임과 스킬을 별도로 설치합니다:

```bash
pipx install session-peer
session-peer --version
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
npx -y skills@latest list --global --json
```

Skills CLI는 Claude Code용 사본과 Codex·Antigravity 공용 사본을 만듭니다. 스킬 목록이 캐시돼 있으면 새 에이전트 세션을 여세요.

### 업데이트

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

위 런타임 명령은 pipx 설치용입니다. 기존 런타임 패키지 관리자를 계속 사용하세요. 런타임 업그레이드는 스킬을 갱신하지 않습니다. 다른 설치 방식과 고정 버전 설치는 사용 안내를 참고하세요.

큐 등록이나 제출은 수신 확인이 아닙니다. 제출 결과가 미확정이면 자동 재전송하지 마세요. Codex 회신 대기 절차는 사용 안내에 있습니다.

## 문서

- [설치 변형·고정 버전·호환성·회신 대기](docs/usage.ko.md)
- [배포 정본 에이전트 지침](session-peer/SKILL.md)
- [개발 검증 및 릴리스 절차](CONTRIBUTING.ko.md)
- [런타임 CLI 참조(v1.0.3)](https://github.com/abruption/session-peer/blob/v1.0.3/docs/cli-reference.md)

## 라이선스

[MIT](LICENSE)

## 지원 및 보안

스킬 문서·설치 문제는 [이슈](https://github.com/abruption/session-peer-skill/issues/new)에 등록하세요. CLI·전송 문제는 [런타임 이슈](https://github.com/abruption/session-peer/issues)를 이용하세요.

취약점은 이메일 대체 경로를 포함한 [관리자의 보안 신고 안내](https://github.com/abruption/session-peer/blob/main/SECURITY.md)에 따라 비공개로 신고하세요. 공개 이슈에는 비밀정보·대화 본문·세션 식별자를 올리지 마세요.
