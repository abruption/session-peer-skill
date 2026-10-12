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

### TypeScript skill releases

The TS skill has an independent version and uses annotated `session-peer-ts-vX.Y.Z` tags. Python `vX.Y.Z` tags and metadata are not changed for a TS-only release.

1. Before finalizing successor metadata, verify that a published npm runtime supports its exact profile. Minimum CLI version, feature coverage reference, and doctor profile support are separate requirements.
2. Set the version in `session-peer-ts/SKILL.md`, update its instructions and TS setup/compatibility guides, the four README notices, and the reviewed profile in `scripts/test-ts-skill.mjs`. Run `node scripts/validate-skill.mjs --tag session-peer-ts-vX.Y.Z` and the isolated lifecycle check `node scripts/test-ts-skill.mjs`.
3. Merge after current-commit checks/review, validate the merge commit, create and push its annotated TS tag, and wait for tag CI. Publish its GitHub release with `--latest=false` to preserve the Python release channel. Record the peeled commit, canonical TS `SKILL.md` SHA-256, runtime/profile evidence, and verification limits.
4. Coordinate the TS repository's four-language guidance/PARITY with that same reviewed immutable skill commit in a separate change. Do not update Python snapshots, remote runtimes, or users' installed skills as part of a TS skill publication.
