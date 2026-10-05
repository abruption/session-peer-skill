# Contributing

[Back to README](README.md)

## Development

Validate the skill metadata, README and usage-guide consistency, discovery, and a clean isolated installation before opening a pull request. CI uses the Skills CLI version pinned in `.github/workflows/validate.yml`:

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

## Releasing

1. Set `metadata.version` in `session-peer/SKILL.md` and the pinned tag in all four usage guides to the new version. Update `runtime-min-version`, `runtime-full-version`, and the matching sentences in the README files and usage guides when runtime requirements change.
2. Run `node scripts/validate-skill.mjs` and merge the change.
3. Tag the merge commit with `git tag -a vX.Y.Z -m 'session-peer skill vX.Y.Z'`, push the tag, and publish the GitHub release. CI rejects a tag that differs from `metadata.version`.
4. Sync the runtime repository's compatibility snapshot: copy `session-peer/SKILL.md` to `skills/session-peer/SKILL.md` in [abruption/session-peer](https://github.com/abruption/session-peer), confirm the files are byte-identical with `cmp`, and open a pull request there.
