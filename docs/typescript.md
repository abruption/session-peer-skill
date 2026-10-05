# TypeScript runtime skill

[Back to README](../README.md)

The separate `session-peer-ts` skill supports the npm TypeScript runtime 0.1.0 baseline and probes help before using development features. It preserves the Python `session-peer` skill. This is source preparation, not a new skill tag or npm release.

Choose a reviewed **40-character commit SHA**, agent (`codex` or `claude-code`),
and scope explicitly. Run in the intended project; omitting `--global` selects
project scope. Inspect existing files before accepting an overwrite. For global
scope add `--global` consistently to add/list/remove. Codex uses the shared
`.agents/skills` directory, so agent selection is not an isolation boundary from
other clients that discover that directory.

```sh
npx -y skills@1.7.0 add https://github.com/abruption/session-peer-skill/tree/REVIEWED_COMMIT/session-peer-ts \
  --skill session-peer-ts --agent codex --copy --yes
npx -y skills@1.7.0 list --agent codex --json
npx -y skills@1.7.0 remove session-peer-ts --agent codex --yes
```

Replace `REVIEWED_COMMIT` before running. To update, review another exact commit
and repeat `add` with the same scope/agent; `update` follows a moving source and
is not the pinned update workflow. Review your installed copy for local edits
first. Installation choices never authorize sending a message or modifying
runtime/service configuration. Restart the agent if its catalog is cached.

`session-peer-ts/SKILL.md` declares `runtime-implementation: "typescript"` and
`runtime-capability-policy: "probe-help"`; its independent skill version is 0.1.0.
The existing `vX.Y.Z` tag workflow still belongs to the Python skill. No TS release
tag is created by this change. Run `node scripts/test-ts-skill.mjs` for isolated
install, pinned-source replacement, and removal evidence.
