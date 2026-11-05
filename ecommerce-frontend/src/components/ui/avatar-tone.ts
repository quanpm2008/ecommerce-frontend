export type AvatarTone = 'green' | 'sand' | 'blue' | 'gray'

const TONES: AvatarTone[] = ['green', 'sand', 'blue', 'gray']

/** Stable tone per id/name so a shop keeps the same colour everywhere. */
export function toneFor(key: string): AvatarTone {
  let hash = 0
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return TONES[Math.abs(hash) % TONES.length]
}
