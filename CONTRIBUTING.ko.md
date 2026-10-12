# 기여 안내

[README로 돌아가기](README.ko.md)

## 개발 검증

변경 검토 요청인 풀 리퀘스트(PR)를 만들기 전에 스킬 메타데이터, README와 사용 안내 간 일관성, 스킬 탐색, 초기 상태의 격리 환경에서의 설치를 검증합니다. 지속적 통합(CI)은 변경 사항을 자동으로 검증하는 과정이며, `.github/workflows/validate.yml`에 고정된 Skills CLI 버전을 사용합니다.

```bash
node scripts/validate-skill.mjs
npx -y skills@1.7.0 add . --list
skill_home="$(mktemp -d)"
HOME="$skill_home" npx -y skills@1.7.0 add . \
  --skill session-peer --global \
  --agent claude-code --agent codex --agent antigravity \
  --copy --yes
cmp session-peer/SKILL.md "$skill_home/.agents/skills/session-peer/SKILL.md"
cmp session-peer/SKILL.md "$skill_home/.claude/skills/session-peer/SKILL.md"
```

## 릴리스 절차

1. `session-peer/SKILL.md`의 `metadata.version`과 사용 안내 4개 언어판의 고정 태그를 새 버전으로 변경합니다. 런타임 요구 사항이 바뀌면 `runtime-min-version`, `runtime-full-version`, README 파일들과 사용 안내의 해당 문장도 함께 업데이트합니다.
2. `node scripts/validate-skill.mjs`를 실행한 뒤 변경을 병합합니다.
3. 병합 커밋에 `git tag -a vX.Y.Z -m 'session-peer skill vX.Y.Z'`로 태그를 만들고, 원격 저장소에 태그를 푸시한 뒤 GitHub 릴리스를 게시합니다. 태그가 `metadata.version`과 다르면 CI에서 거부됩니다.
4. 런타임 저장소의 호환 스냅샷을 동기화합니다. `session-peer/SKILL.md`를 [abruption/session-peer](https://github.com/abruption/session-peer)의 `skills/session-peer/SKILL.md`로 복사하고, `cmp`로 두 파일이 바이트 단위로 일치하는지 확인한 뒤 그 저장소에 PR을 만듭니다.

### TypeScript 스킬 릴리스

TS 스킬은 독립된 버전을 사용하며, 주석이 있는 `session-peer-ts-vX.Y.Z` 태그로 발행합니다. TS만 릴리스할 때는 Python의 `vX.Y.Z` 태그와 메타데이터를 변경하지 않습니다.

1. 후속 스킬의 메타데이터를 확정하기 전에, 공개된 npm 런타임이 해당 프로필을 정확히 지원하는지 확인합니다. 최소 CLI 버전, 문서가 다루는 기능의 기준 버전, doctor의 프로필 지원 여부는 서로 다른 조건입니다.
2. `session-peer-ts/SKILL.md`의 버전과 본문, TS 설정·호환성 안내, README 4개 언어판의 TS 안내, `scripts/test-ts-skill.mjs`의 검토된 프로필을 함께 갱신합니다. `node scripts/validate-skill.mjs --tag session-peer-ts-vX.Y.Z`와 격리 설치 검증인 `node scripts/test-ts-skill.mjs`를 실행합니다.
3. 현재 커밋의 검사와 리뷰를 마친 뒤 병합하고, 병합 커밋을 검증합니다. 해당 커밋에 주석이 있는 TS 태그를 만들어 push한 뒤 태그 CI 완료를 기다립니다. Python 릴리스 채널을 유지하도록 `--latest=false`로 GitHub Release를 게시합니다. 태그가 가리키는 실제 커밋, TS 정본 `SKILL.md`의 SHA-256, 런타임·프로필 근거, 검증 한계를 기록합니다.
4. TS 저장소의 4개 언어 안내와 PARITY가 동일한 검토된 스킬 커밋을 참조하도록 별도 변경으로 조율합니다. TS 스킬 발행 과정에서 Python 스냅샷, 원격 런타임, 사용자 설치 스킬을 갱신하지 않습니다.
