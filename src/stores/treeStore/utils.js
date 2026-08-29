export const MAX_JSON_SIZE = 5 * 1024 * 1024

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

export function sanitizeValue (value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value)
  }
  return value
}

export function sanitizeObject (obj) {
  const safe = {}
  for (const key of Object.keys(obj)) {
    if (UNSAFE_KEYS.has(key)) continue
    safe[key] = sanitizeValue(obj[key])
  }
  return safe
}

export function isDescendantPath (ancestorPath, candidatePath) {
  if (!ancestorPath?.length || !candidatePath?.length) return false
  if (candidatePath.length <= ancestorPath.length) return false
  return ancestorPath.every((key, index) => candidatePath[index] === key)
}

export function pathsEqual (a, b) {
  if (!a || !b || a.length !== b.length) return false
  return a.every((key, index) => key === b[index])
}

export function isInvalidMove (sourcePath, targetPath, dropPosition) {
  if (pathsEqual(sourcePath, targetPath)) return true
  if (isDescendantPath(sourcePath, targetPath)) return true

  if (dropPosition !== 'inside') {
    const targetParentPath = targetPath.slice(0, -1)
    if (pathsEqual(sourcePath, targetParentPath)) return true
    if (isDescendantPath(sourcePath, targetParentPath)) return true
  }

  return false
}
