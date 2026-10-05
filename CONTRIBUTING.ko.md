# 기여 안내

[README로 돌아가기](README.ko.md)

## 개발 검증

PR을 열기 전에 스킬 메타데이터, README·사용 안내 간 일관성, 스킬 탐색, 격리된 설치를 검증합니다. CI는 `.github/workflows/validate.yml`에 고정된 Skills CLI 버전을 사용합니다.

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

1. `session-peer/SKILL.md`의 `metadata.version`과 사용 안내 4개 언어판의 고정 태그를 새 버전으로 바꿉니다. runtime 요구 사항이 바뀌면 `runtime-min-version`, `runtime-full-version`과 README와 사용 안내의 해당 본문 문구도 함께 갱신합니다.
2. `node scripts/validate-skill.mjs`를 실행한 뒤 변경을 병합합니다.
3. 병합 커밋에 `git tag -a vX.Y.Z -m 'session-peer skill vX.Y.Z'`로 태그를 만들어 push하고 GitHub Release를 게시합니다. 태그가 `metadata.version`과 다르면 CI가 실패합니다.
4. runtime 저장소의 호환 스냅샷을 동기화합니다. `session-peer/SKILL.md`를 [abruption/session-peer](https://github.com/abruption/session-peer)의 `skills/session-peer/SKILL.md`로 복사하고, `cmp`로 바이트 단위 일치를 확인한 뒤 그 저장소에 PR을 올립니다.
