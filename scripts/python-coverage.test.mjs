import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { validatePythonCoverage, validateLocalizedCoverage, validateLocalizedCodexBin } from './python-coverage.mjs'

const text = (full = '1.3.0', codexBin = '1.0.1') =>
  `The published CLI coverage reference is session-peer ${full}.\n` +
  `receiver policy \`codexBin\` requires\n session-peer ${codexBin} or newer`

test('coverage can advance while the receiver feature floor stays at 1.0.1', () => {
  for (const full of ['1.0.1', '1.3.0']) {
    assert.deepEqual(validatePythonCoverage(text(full), '0.9.1', full), [])
  }
})

test('coverage mismatch or absence fails independently of a valid receiver floor', () => {
  for (const body of [text('1.0.1'), text().split('\n').slice(1).join('\n')]) {
    const errors = validatePythonCoverage(body, '0.9.1', '1.3.0')
    assert.equal(errors.length, 1)
    assert.match(errors[0], /body coverage runtime/)
  }
})

test('changed or missing receiver requirement fails independently of valid coverage', () => {
  for (const body of [text('1.3.0', '1.3.0'), text().split('\n')[0]]) {
    const errors = validatePythonCoverage(body, '0.9.1', '1.3.0')
    assert.equal(errors.length, 1)
    assert.match(errors[0], /codexBin requires runtime 1.0.1/)
  }
})

test('malformed minimum and full metadata fail without throwing', () => {
  for (const bad of [undefined, '', '1.3', 'v1.3.0', '1.3.0-preview', '-1.3.0']) {
    assert.match(validatePythonCoverage(text(), bad, '1.3.0').join('\n'), /runtime-min-version must be/)
    assert.match(validatePythonCoverage(text(), '0.9.1', bad).join('\n'), /runtime-full-version must be/)
  }
})

test('minimum comparison is numeric across major, minor and patch components', () => {
  for (const [minimum, full] of [['2.0.0', '1.3.0'], ['1.10.0', '1.9.0'], ['1.3.10', '1.3.9']]) {
    assert.match(validatePythonCoverage(text(full), minimum, full).join('\n'), /must not exceed/)
  }
  for (const [minimum, full] of [['1.9.0', '1.10.0'], ['1.3.9', '1.3.10'], ['1.3.0', '1.3.0']]) {
    assert.deepEqual(validatePythonCoverage(text(full), minimum, full), [])
  }
})

// These literal documentation claims are independent of the validator's parser.
const currentFull = '1.3.0'
const legacyFull = '1.0.1'
const claims = {
  en: 'The published Python CLI coverage reference is session-peer 1.3.0.',
  ko: '공개 Python CLI 기능 범위의 기준 버전은 session-peer 1.3.0입니다.',
  ja: '公開 Python CLI の機能範囲の基準は session-peer 1.3.0 です。',
  zh: '已发布 Python CLI 功能的覆盖基准为 session-peer 1.3.0。'
}
const documents = [
  ['README.md', 'en'], ['README.ko.md', 'ko'],
  ['README.ja.md', 'ja'], ['README.zh-CN.md', 'zh'],
  ['docs/usage.md', 'en'], ['docs/usage.ko.md', 'ko'],
  ['docs/usage.ja.md', 'ja'], ['docs/usage.zh-CN.md', 'zh']
]
const readDocument = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
const changedClaim = (body, claim, version) => body.replace(claim, claim.replace(currentFull, version))

for (const [path, locale] of documents) {
  test(`${path}: actual current and legacy coverage pass independently of feature mentions`, () => {
    const body = readDocument(path)
    const claim = claims[locale]
    assert.ok(body.includes(claim), 'the actual document must contain its explicit coverage assertion')
    assert.deepEqual(validateLocalizedCoverage(path, body, currentFull), [])
    const legacy = changedClaim(body, claim, legacyFull)
    assert.deepEqual(validateLocalizedCoverage(path, legacy, legacyFull), [])
    if (path.startsWith('docs/')) {
      assert.deepEqual(validateLocalizedCodexBin(path, body), [])
      assert.deepEqual(validateLocalizedCodexBin(path, legacy), [])
    }
  })

  test(`${path}: wrong or absent coverage claim cannot be masked by other version references`, () => {
    const body = readDocument(path)
    const claim = claims[locale]
    const wrong = changedClaim(body, claim, legacyFull)
    const missing = body.replace(claim, '')
    for (const mutation of [wrong, missing]) {
      const withFeature = mutation + '\nExplain requires session-peer 1.3.0.\n'
      assert.ok(validateLocalizedCoverage(path, withFeature, currentFull).length > 0)
    }
    for (const mutation of [body, missing]) {
      const withFeature = mutation + '\nAn independent feature requires session-peer 1.0.1.\n'
      assert.ok(validateLocalizedCoverage(path, withFeature, legacyFull).length > 0)
    }
    if (path.startsWith('docs/')) {
      assert.deepEqual(validateLocalizedCodexBin(path, wrong), [])
      assert.deepEqual(validateLocalizedCodexBin(path, missing), [])
    }
  })

  test(`${path}: malformed claims and malformed expected coverage versions fail`, () => {
    const body = readDocument(path)
    const claim = claims[locale]
    for (const version of ['+1.3.0', '-1.3.0', 'v1.3.0', '1.3', '1.3.0-preview', '1.3.0.2', '01.3.0']) {
      const mutation = changedClaim(body, claim, version)
      assert.ok(validateLocalizedCoverage(path, mutation, currentFull).length > 0, version)
      assert.ok(validateLocalizedCoverage(path, mutation, version).length > 0, version)
    }
    for (const version of [undefined, '', '+1.3.0', '-1.3.0', '1.3.0-preview']) {
      assert.ok(validateLocalizedCoverage(path, body, version).length > 0, String(version))
    }
  })

  test(`${path}: duplicate contradictory coverage assertions fail in either order`, () => {
    const body = readDocument(path)
    const claim = claims[locale]
    const contradictory = claim.replace(currentFull, legacyFull)
    for (const pair of [claim + '\n' + contradictory, contradictory + '\n' + claim]) {
      const mutation = body.replace(claim, pair)
      assert.ok(validateLocalizedCoverage(path, mutation, legacyFull).length > 0)
      assert.ok(validateLocalizedCoverage(path, mutation, currentFull).length > 0)
    }
  })

  if (path.startsWith('docs/')) {
    test(`${path}: receiver prerequisite is required independently of all other 1.0.1 mentions`, () => {
      const body = readDocument(path)
      const prerequisites = body.split('\n').filter(line =>
        line.includes('`codexBin`') && line.includes('`attemptId`') && line.includes('session-peer 1.0.1'))
      assert.equal(prerequisites.length, 1, 'select only the actual prerequisite sentence')
      const prerequisite = prerequisites[0]
      assert.deepEqual(validateLocalizedCodexBin(path, body), [])
      const decoy = '\nHistorical note: `codexBin` is available in session-peer 1.0.1.\n'
      for (const mutation of [body.replace(prerequisite, prerequisite.replace('session-peer 1.0.1', 'session-peer 1.3.0')),
        body.replace(prerequisite, '')]) {
        const withFeature = mutation + decoy
        assert.ok(validateLocalizedCodexBin(path, withFeature).length > 0)
        assert.deepEqual(validateLocalizedCoverage(path, withFeature, currentFull), [])
      }
    })
  }
}
