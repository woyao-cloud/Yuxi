/**
 * Time formatting utilities
 *
 * Migrated from Vue project's time.js with dayjs.
 */

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const DEFAULT_TZ = 'Asia/Shanghai'
dayjs.tz.setDefault(DEFAULT_TZ)

const NUMERIC_REGEX = /^-?\d+(?:\.\d+)?$/

const coerceDayjs = (value: unknown): dayjs.Dayjs | null => {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return dayjs(value).tz(DEFAULT_TZ)
  }

  const stringValue = String(value).trim()
  if (!stringValue) {
    return null
  }

  if (NUMERIC_REGEX.test(stringValue)) {
    const numeric = Number(stringValue)
    if (Number.isNaN(numeric)) {
      return null
    }

    // Values < 1e12 are treated as seconds timestamps, otherwise milliseconds
    if (Math.abs(numeric) < 1e12) {
      return dayjs.unix(numeric).tz(DEFAULT_TZ)
    }
    return dayjs(numeric).tz(DEFAULT_TZ)
  }

  // Parse ISO strings (dayjs auto-detects timezone info like Z suffix)
  // First convert to UTC then set timezone for correct conversion
  const parsed = dayjs(stringValue)
  if (!parsed.isValid()) {
    return null
  }
  return parsed.utc().tz(DEFAULT_TZ)
}

export const parseToShanghai = (value: unknown): dayjs.Dayjs | null => coerceDayjs(value)

export const formatDateTime = (value: unknown, format = 'YYYY-MM-DD HH:mm'): string => {
  const parsed = coerceDayjs(value)
  if (!parsed) return '-'
  return parsed.format(format)
}

export const formatFullDateTime = (value: unknown): string =>
  formatDateTime(value, 'YYYY-MM-DD HH:mm:ss')

export const formatRelative = (value: unknown): string => {
  const parsed = coerceDayjs(value)
  if (!parsed) return '-'
  return parsed.fromNow()
}

export const sortByDatetimeDesc = <T>(
  items: T[],
  accessor: (item: T) => unknown
): T[] => {
  const copy = [...items]
  copy.sort((a, b) => {
    const first = coerceDayjs(accessor(a))
    const second = coerceDayjs(accessor(b))

    if (!first && !second) return 0
    if (!first) return 1
    if (!second) return -1
    return second.valueOf() - first.valueOf()
  })
  return copy
}

export default dayjs