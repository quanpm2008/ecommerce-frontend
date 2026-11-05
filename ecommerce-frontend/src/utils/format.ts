/**
 * Display formatting. The API sends money as integer VND and times as UTC
 * ISO strings (api.docx §3.6); the UI always shows Vietnam time (GMT+7).
 */

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

const vndFormatter = new Intl.NumberFormat('vi-VN')

/** 199000 → "199.000đ" */
export function formatVnd(amount: number) {
  return `${vndFormatter.format(amount)}đ`
}

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  const values: Record<string, string> = {}
  for (const part of new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hourCycle: 'h23', ...options }).formatToParts(
    new Date(iso),
  )) {
    values[part.type] = part.value
  }
  return values
}

/** "12/10/2026" */
export function formatDate(iso: string) {
  const p = parts(iso, { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${p.day}/${p.month}/${p.year}`
}

/** "12/10/2026 14:30" */
export function formatDateTime(iso: string) {
  const p = parts(iso, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`
}

/** "09/2026" */
export function formatMonthYear(iso: string) {
  const p = parts(iso, { month: '2-digit', year: 'numeric' })
  return `${p.month}/${p.year}`
}

/** 4.8 → "4.8"; null → "–" (no ratings yet). */
export function formatRating(value: number | null) {
  return value == null ? '–' : value.toFixed(1)
}

/** First letter without Vietnamese diacritics: "Áo" → "A", "Đèn" → "D". */
function letter(word: string) {
  return word[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'D').toUpperCase()
}

/** Person: first + last word, "Nguyễn Văn A" → "NA". */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return letter(words[0]) + (words.length > 1 ? letter(words[words.length - 1]) : '')
}

/** Shop: first two words without a leading "Shop", "Shop Minh Anh" → "MA", "Áo Khoác Hà Nội" → "AK". */
export function shopInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const rest = words.length > 1 && words[0].toLowerCase() === 'shop' ? words.slice(1) : words
  if (rest.length === 0) return '?'
  return rest
    .slice(0, 2)
    .map(letter)
    .join('')
}

/** Seconds → "12:30" for payment countdowns. */
export function formatCountdown(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
