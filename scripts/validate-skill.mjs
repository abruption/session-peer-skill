#!/usr/bin/env node
// Validate the published skill metadata and the version facts repeated in each README.
import { readFileSync } from 'node:fs'

const skillDir = 'session-peer'
const readmes = ['README.md', 'README.ko.md', 'README.ja.md', 'README.zh-CN.md']
const errors = []

const read = path => readFileSync(path, 'utf8')

function parseFrontmatter (text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return null
  const fields = {}
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!field) {
      errors.push(`SKILL.md: unsupported frontmatter line: ${line}`)
      continue
    }
    if (field[1] in fields) errors.push(`SKILL.md: duplicate frontmatter key: ${field[1]}`)
    fields[field[1]] = field[2].trim()
  }
  return fields
}

const skill = read(`${skillDir}/SKILL.md`)
const meta = parseFrontmatter(skill)
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
}

const minimum = skill.match(/session-peer (\d+\.\d+\.\d+) or newer/)?.[1]
if (!minimum) errors.push('SKILL.md: minimum runtime version sentence not found')

const pinnedTags = new Set()
for (const readme of readmes) {
  const text = read(readme)
  const stated = text.match(/session-peer (\d+\.\d+\.\d+)/)?.[1]
  if (stated !== minimum) errors.push(`${readme}: minimum runtime ${stated ?? 'missing'} does not match SKILL.md ${minimum}`)
  const tags = [...text.matchAll(/session-peer-skill\/tree\/(v\d+\.\d+\.\d+)\//g)].map(tag => tag[1])
  if (tags.length === 0) errors.push(`${readme}: pinned install tag not found`)
  for (const tag of tags) pinnedTags.add(tag)
  for (const other of readmes) {
    if (other !== readme && !text.includes(`(${other})`)) errors.push(`${readme}: missing language link to ${other}`)
  }
}
if (pinnedTags.size > 1) errors.push(`README files pin different tags: ${[...pinnedTags].join(', ')}`)

const agentYaml = read(`${skillDir}/agents/openai.yaml`)
for (const key of ['display_name', 'short_description', 'default_prompt']) {
  if (!new RegExp(`^  ${key}: ".+"$`, 'm').test(agentYaml)) errors.push(`agents/openai.yaml: interface.${key} is required`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`)
  process.exit(1)
}
console.log(`ok: ${skillDir} metadata and ${readmes.length} README files are consistent (runtime ${minimum})`)
