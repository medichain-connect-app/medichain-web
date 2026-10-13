const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** How long a doctor can see shared records. `ms: null` means it never expires. */
export const ACCESS_DURATIONS = [
  { value: '1d', label: '24 hours', ms: DAY },
  { value: '7d', label: '7 days', ms: 7 * DAY },
  { value: '30d', label: '30 days', ms: 30 * DAY },
  { value: 'never', label: 'No expiry', ms: null },
]

export const DEFAULT_ACCESS_DURATION = '7d'

/** ISO expiry for a duration value, or null for no expiry. */
export function expiryFor(value, now = Date.now()) {
  const duration = ACCESS_DURATIONS.find(d => d.value === value)
  return duration && duration.ms ? new Date(now + duration.ms).toISOString() : null
}

/**
 * Remaining access as short text plus an urgency level for styling.
 * level: 'none' (no expiry) | 'ok' | 'soon' (under 24h) | 'expired'
 */
export function remainingAccess(expiresAt, now = Date.now()) {
  if (!expiresAt) return { text: 'No expiry', level: 'none' }
  const left = new Date(expiresAt).getTime() - now
  if (left <= 0) return { text: 'Expired', level: 'expired' }

  const days = Math.floor(left / DAY)
  const hours = Math.floor((left % DAY) / HOUR)
  const minutes = Math.max(1, Math.floor((left % HOUR) / 60000))

  let text
  if (days > 0) text = `${days}d ${hours}h left`
  else if (hours > 0) text = `${hours}h ${minutes}m left`
  else text = `${minutes}m left`

  return { text, level: left < DAY ? 'soon' : 'ok' }
}
