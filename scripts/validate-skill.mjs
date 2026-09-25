#!/usr/bin/env node
// Validate the published skill metadata and the version facts repeated in each README.
// Usage: node scripts/validate-skill.mjs [--tag vX.Y.Z]
// On a tag push in GitHub Actions, GITHUB_REF_NAME is checked as the tag.
import { readFileSync } from 'node:fs'

const skillDir = 'session-peer'
const readmes = ['README.md', 'README.ko.md', 'README.ja.md', 'README.zh-CN.md']
const metadataKeys = ['version', 'runtime-min-version', 'runtime-full-version']
const semver = /^\d+\.\d+\.\d+$/
const errors = []

const read = path => readFileSync(path, 'utf8')

function releaseTag () {
  const index = process.argv.indexOf('--tag')
  if (index !== -1) return process.argv[index + 1]
  if (process.env.GITHUB_REF_TYPE === 'tag') return process.env.GITHUB_REF_NAME
  return null
}

// Supports the subset used here: top-level scalars and one `metadata` map of quoted strings.
function parseFrontmatter (text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return null
  const fields = {}
  let map = null
  for (const line of match[1].split('\n')) {
    const nested = line.match(/^ {2}([a-z0-9][a-z0-9-]*):\s*(.*)$/)
    if (nested && map) {
      const value = nested[2].match(/^"([^"]*)"$/)
      if (!value) errors.push(`SKILL.md: metadata.${nested[1]} must be a double-quoted string`)
      if (nested[1] in map) errors.push(`SKILL.md: duplicate metadata key: ${nested[1]}`)
      map[nested[1]] = value ? value[1] : nested[2]
      continue
    }
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!field) {
      errors.push(`SKILL.md: unsupported frontmatter line: ${line}`)
      continue
    }
    if (field[1] in fields) errors.push(`SKILL.md: duplicate frontmatter key: ${field[1]}`)
    if (field[1] === 'metadata' && field[2] === '') {
      map = fields.metadata = {}
    } else {
      map = null
      fields[field[1]] = field[2].trim()
    }
  }
  return fields
}

const skill = read(`${skillDir}/SKILL.md`)
const meta = parseFrontmatter(skill)
const metadata = meta?.metadata ?? {}
if (!meta) {
  errors.push('SKILL.md: missing YAML frontmatter')
} else {
  if (meta.name !== skillDir) errors.push(`SKILL.md: name must be '${skillDir}', got '${meta.name}'`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(meta.name ?? '') || meta.name.length > 64) {
    errors.push('SKILL.md: name must be lowercase kebab-case, at most 64 characters')
  }
  if (!meta.description) errors.push('SKILL.md: description is required')
  else if (meta.description.length > 1024) errors.push('SKILL.md: description exceeds 1024 characters')
  if (!meta['allowed-tools']) errors.push('SKILL.md: allowed-tools is required')
  for (const key of metadataKeys) {
    if (!semver.test(metadata[key] ?? '')) errors.push(`SKILL.md: metadata.${key} must be an X.Y.Z version`)
  }
}

const { version, 'runtime-min-version': minimum, 'runtime-full-version': full } = metadata

const statedMinimum = skill.match(/session-peer (\d+\.\d+\.\d+) or newer/)?.[1]
if (statedMinimum !== minimum) {
  errors.push(`SKILL.md: body minimum runtime ${statedMinimum ?? 'missing'} does not match metadata ${minimum}`)
}
const statedOneZero = skill.match(/exist only in (\d+\.\d+\.\d+) and newer/)?.[1]
if (statedOneZero !== '1.0.0') {
  errors.push(`SKILL.md: original 1.0-only options require 1.0.0, got ${statedOneZero ?? 'missing'}`)
}
const statedFull = skill.match(/receiver policy `codexBin` requires\s+session-peer (\d+\.\d+\.\d+) or newer/)?.[1]
if (statedFull !== full) {
  errors.push(`SKILL.md: receiver codexBin runtime ${statedFull ?? 'missing'} does not match metadata ${full}`)
}

for (const readme of readmes) {
  const text = read(readme)
  const stated = text.match(/session-peer (\d+\.\d+\.\d+)/)?.[1]
  if (stated !== minimum) errors.push(`${readme}: minimum runtime ${stated ?? 'missing'} does not match metadata ${minimum}`)
  if (!text.includes('session-peer 1.0.0')) errors.push(`${readme}: original 1.0-only option runtime not stated`)
  if (!text.includes(`session-peer ${full}`)) errors.push(`${readme}: full runtime ${full} not stated`)
  const tags = [...text.matchAll(/session-peer-skill\/tree\/(v\d+\.\d+\.\d+)\//g)].map(tag => tag[1])
  if (tags.length === 0) errors.push(`${readme}: pinned install tag not found`)
  for (const tag of tags) {
    if (tag !== `v${version}`) errors.push(`${readme}: pinned tag ${tag} does not match metadata version ${version}`)
  }
  for (const other of readmes) {
    if (other !== readme && !text.includes(`(${other})`)) errors.push(`${readme}: missing language link to ${other}`)
  }
}

const tag = releaseTag()
if (tag !== null && tag !== `v${version}`) errors.push(`release tag ${tag} does not match metadata version ${version}`)

const agentYaml = read(`${skillDir}/agents/openai.yaml`)
for (const key of ['display_name', 'short_description', 'default_prompt']) {
  if (!new RegExp(`^  ${key}: ".+"$`, 'm').test(agentYaml)) errors.push(`agents/openai.yaml: interface.${key} is required`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`)
  process.exit(1)
}
console.log(`ok: ${skillDir} ${version} (runtime ${minimum}+, full ${full}+) is consistent across metadata and ${readmes.length} README files`)
