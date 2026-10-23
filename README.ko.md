<div align="center">

# session-peer 스킬

[English](README.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

[session-peer](https://github.com/abruption/session-peer)를 사용하여 Claude Code, Codex, 실행 중이며 등록된 Antigravity 세션을 찾고 메시지를 보내는 에이전트 스킬입니다. 로컬 환경, SSH 연결, 또는 선택 기능인 페어링 기기 전송을 통해 사용할 수 있습니다. 페어링은 기기 사이의 연결을 등록하는 절차입니다.

</div>

## 데모

![Claude Code와 Codex 사이에 메시지를 주고받는 session-peer 런타임](https://raw.githubusercontent.com/abruption/session-peer/v1.0.1/docs/assets/session-peer-live-codex-claude.gif)

런타임 데모는 Claude Code와 Codex가 메시지를 주고받는 모습을 보여 줍니다. 스킬은 에이전트가 따를 지침을 제공합니다.

## 빠른 시작

기본 Python CLI 명령에는 session-peer 0.9.1 이상이 필요합니다. 공개 Python CLI 기능 범위의 기준 버전은 session-peer 1.3.0입니다. 페어링 기기 전송은 선택 기능이며, Unix 환경에서 Python 3.11 이상과 `session-peer[relay]`가 필요합니다.
v1.0.3 보안 수정을 적용하려면 Python 런타임 1.0.3 이상을 사용합니다. 위 호환 버전은 CLI(명령줄 인터페이스) 기능 지원 기준이며 보안 권장 버전과 별개입니다.

### 설치

런타임과 스킬은 별도로 설치합니다.

```bash
pipx install session-peer
session-peer --version
npx -y skills@latest add abruption/session-peer-skill \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
npx -y skills@latest list --global --json
```

Skills CLI는 Claude Code용 사본과 Codex·Antigravity가 함께 사용하는 공용 사본을 만듭니다. 스킬 목록이 캐시되어 이전 목록을 계속 사용하는 경우에는 새 에이전트 세션을 시작합니다.

### 업데이트

```bash
pipx upgrade session-peer
npx -y skills@latest update session-peer --global --yes
```

위 런타임 명령은 pipx로 설치한 경우에 사용합니다. 런타임은 기존에 사용한 패키지 관리자로 계속 관리합니다. 런타임을 업그레이드해도 스킬은 업데이트되지 않습니다. 다른 설치 방식과 고정 버전 설치 방법은 사용 안내를 참고합니다.

`queued` 또는 `submitted` 상태는 수신자가 메시지를 처리했다는 확인이 아닙니다. 제출 결과가 불확실한 경우 자동으로 재전송하지 마세요. Codex 회신 대기 절차는 사용 안내를 참고하세요.

별도의 `session-peer-ts` 스킬 0.3.0 프로필(최소 런타임 0.1.0, 기능 안내 기준 0.4.0)은 공개 npm 런타임 0.4.0이 인식합니다. 기본 명령도 실제로 선택된 TypeScript 런타임의 버전과 도움말을 확인한 뒤 사용해야 하며, 선택 기능에는 플랫폼·비공개 저장소·권한·작성자 검사도 적용됩니다. 상관관계 식별자, 제한된 대기, 운영자가 명시적으로 확인하는 수신 확인은 [선택적 handoff 범위 안내](docs/typescript-handoff.md)를 참고하세요. 큐 등록이나 입력 주입은 자동 수신 확인이 아닙니다. 별도로 승인·발행된 불변 스킬 릴리스를 선택하고 기록된 소스 커밋과 콘텐츠 해시를 확인하세요. 런타임 발행은 스킬을 발행하거나 설치하지 않으며 설치 권한도 부여하지 않습니다. 에이전트, 프로젝트 또는 전역 설치 범위, 검토된 커밋을 명시하는 설치 방법은 [TypeScript 설정 안내](docs/typescript.md)를 참고합니다.

Python 1.3.0의 선택 기능과 사용 조건은 [사용 안내](docs/usage.ko.md#python-13-사용-절차)를 참고합니다.

## 문서

- [TypeScript 스킬 설치·고정 버전 업데이트·삭제](docs/typescript.md)
- [설치 방식별 안내·고정 버전·호환성·회신 대기](docs/usage.ko.md)
- [배포된 에이전트 지침](session-peer/SKILL.md)
- [개발 검증 및 릴리스 절차](CONTRIBUTING.ko.md)
- [런타임 CLI 참조(v1.0.4)](https://github.com/abruption/session-peer/blob/v1.0.4/docs/cli-reference.md)

## 라이선스

[MIT](LICENSE)

## 지원 및 보안

스킬 문서나 설치 관련 문제는 [이슈](https://github.com/abruption/session-peer-skill/issues/new)에 등록합니다. CLI나 전송 관련 문제는 [런타임 이슈](https://github.com/abruption/session-peer/issues)에 등록합니다.

취약점은 [유지관리자의 보안 신고 안내](https://github.com/abruption/session-peer/blob/main/SECURITY.md)에 따라 비공개로 신고합니다. 안내된 이메일로도 신고할 수 있습니다. 공개 이슈에는 비밀정보, 대화 본문, 세션 식별자를 게시해서는 안 됩니다.
