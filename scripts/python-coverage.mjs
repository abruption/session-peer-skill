// Coverage metadata and individual feature floors describe different contracts.
const versionPattern = /^\d+\.\d+\.\d+$/

function greaterVersion (left, right) {
  const rightParts = right.split('.').map(BigInt)
  for (const [index, value] of left.split('.').map(BigInt).entries()) {
    if (value !== rightParts[index]) return value > rightParts[index]
  }
  return false
}

export function validatePythonCoverage (skill, minimum, full) {
  const errors = []
  for (const [key, value] of [['runtime-min-version', minimum], ['runtime-full-version', full]]) {
    if (!versionPattern.test(value ?? '')) errors.push(`SKILL.md: metadata.${key} must be an X.Y.Z version`)
  }
  if (versionPattern.test(minimum ?? '') && versionPattern.test(full ?? '') && greaterVersion(minimum, full)) {
    errors.push('SKILL.md: runtime-min-version must not exceed runtime-full-version')
  }
  const statedFull = skill.match(/The published CLI coverage reference is session-peer (\d+\.\d+\.\d+)\.(?=\s|$)/)?.[1]
  if (statedFull !== full || statedFull === undefined) {
    errors.push(`SKILL.md: body coverage runtime ${statedFull ?? 'missing'} does not match metadata ${full}`)
  }
  const codexBinMinimum = skill.match(/receiver policy `codexBin` requires\s+session-peer (\d+\.\d+\.\d+) or newer/)?.[1]
  if (codexBinMinimum !== '1.0.1') {
    errors.push(`SKILL.md: receiver codexBin requires runtime 1.0.1, got ${codexBinMinimum ?? 'missing'}`)
  }
  return errors
}

// Match named claims, never incidental versions in examples or candidate notes.
const localizedClaims = {
  en: {
    coverage: ['The published Python CLI coverage reference is session-peer ', '.'],
    codexBin: ['macOS/Linux receiver policy `codexBin` and Relay diagnostics correlated by `attemptId` require session-peer ', ' or newer.']
  },
  ko: {
    coverage: ['공개 Python CLI 기능 범위의 기준 버전은 session-peer ', '입니다.'],
    codexBin: ['macOS·Linux 수신기 정책의 `codexBin` 기능과 `attemptId`로 이벤트를 연결하는 Relay 진단에는 session-peer ', ' 이상이 필요합니다.']
  },
  ja: {
    coverage: ['公開 Python CLI の機能範囲の基準は session-peer ', ' です。'],
    codexBin: ['macOS/Linux の受信側ポリシーで使う `codexBin` と、`attemptId` で接続試行を関連付けた Relay 診断には session-peer ', ' 以降が必要です。']
  },
  'zh-CN': {
    coverage: ['已发布 Python CLI 功能的覆盖基准为 session-peer ', '。'],
    codexBin: ['macOS/Linux 接收端策略中的 `codexBin`，以及使用 `attemptId` 关联连接尝试的 Relay 诊断，需要 session-peer ', ' 或更高版本。']
  }
}

function hasSingleClaim (path, body, kind, expected) {
  const locale = path.match(/\.(ko|ja|zh-CN)\.md$/)?.[1] ?? 'en'
  const [prefix, suffix] = localizedClaims[locale][kind]
  const parts = body.split(prefix)
  if (parts.length !== 2) return false
  const value = parts[1].match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)
  if (!value || value[0] !== expected) return false
  const rest = parts[1].slice(value[0].length)
  if (!rest.startsWith(suffix)) return false
  // English sentence punctuation cannot be a fourth version component.
  return suffix !== '.' || /^(?:\s|$)/.test(rest.slice(suffix.length))
}

export function validateLocalizedCoverage (path, body, full) {
  return hasSingleClaim(path, body, 'coverage', full)
    ? [] : [`${path}: full runtime ${full} not stated exactly once in its coverage claim`]
}

export function validateLocalizedCodexBin (path, body) {
  return hasSingleClaim(path, body, 'codexBin', '1.0.1')
    ? [] : [`${path}: codexBin prerequisite must state runtime 1.0.1 exactly once`]
}
