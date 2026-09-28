// Real Skills CLI lifecycle in disposable homes and projects; never user agent state.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = mkdtempSync(join(process.env.TASK_TEMP ?? tmpdir(), 'codex-ts-skill-'));
const source = resolve('session-peer-ts');
const expected = readFileSync(join(source, 'SKILL.md'), 'utf8');
const metadata = expected.match(/^---\n([\s\S]*?)\n---/)?.[1];
assert.ok(metadata?.includes('name: session-peer-ts'));
for (const [key, value] of Object.entries({ version: '0.1.0', 'runtime-implementation': 'typescript', 'runtime-min-version': '0.1.0', 'runtime-full-version': '0.1.0', 'runtime-capability-policy': 'probe-help' })) {
  assert.ok(metadata.includes(`  ${key}: "${value}"`), key);
}
try {
  const home = join(root, 'home'), project = join(root, 'project'), next = join(root, 'next');
  for (const path of [home, project, next]) mkdirSync(path);
  cpSync(source, join(next, 'session-peer-ts'), { recursive: true });
  const replacement = expected + '\n<!-- isolated pinned-source update fixture -->\n';
  writeFileSync(join(next, 'session-peer-ts/SKILL.md'), replacement);
  const env = { ...process.env, HOME: home, USERPROFILE: home,
    CODEX_HOME: join(home, '.codex'), CLAUDE_CONFIG_DIR: join(home, '.claude'),
    XDG_CONFIG_HOME: join(home, '.config'), XDG_CACHE_HOME: join(home, '.cache'),
    npm_config_cache: join(root, 'npm-cache'), npm_config_userconfig: join(root, 'npmrc'),
    DISABLE_TELEMETRY: '1', DO_NOT_TRACK: '1', CI: '1' };
  writeFileSync(env.npm_config_userconfig, '');
  function skills(args) {
    const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['-y', 'skills@1.7.0', ...args],
      { cwd: project, env, encoding: 'utf8', timeout: 120_000, shell: process.platform === 'win32' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result.stdout;
  }
  for (const global of [false, true]) {
    const scope = global ? ['--global'] : [];
    const base = global ? home : project;
    const python = join(base, '.agents/skills/session-peer/SKILL.md');
    mkdirSync(join(base, '.agents/skills/session-peer'), { recursive: true });
    writeFileSync(python, 'preserved Python skill fixture');
    for (const [origin, body] of [[source, expected], [join(next, 'session-peer-ts'), replacement]]) {
      skills(['add', origin, '--skill', 'session-peer-ts', '--agent', 'codex', '--agent', 'claude-code', '--copy', '--yes', ...scope]);
      for (const directory of ['.agents/skills', '.claude/skills']) {
        assert.equal(readFileSync(join(base, directory, 'session-peer-ts/SKILL.md'), 'utf8'), body);
      }
      assert.equal(readFileSync(python, 'utf8'), 'preserved Python skill fixture');
      assert.match(skills(['list', '--json', ...scope]), /session-peer-ts/);
    }
    skills(['remove', 'session-peer-ts', '--agent', 'codex', '--agent', 'claude-code', '--yes', ...scope]);
    for (const directory of ['.agents/skills', '.claude/skills']) {
      assert.equal(existsSync(join(base, directory, 'session-peer-ts')), false);
    }
    assert.equal(readFileSync(python, 'utf8'), 'preserved Python skill fixture');
  }
  console.log('ok: TS skill metadata and isolated project/global install, source replacement, list, remove; Python skill preserved');
} finally { rmSync(root, { recursive: true, force: true }); }
