const DATE_ONLY_OR_UTC_MIDNIGHT = /^\d{4}-\d{2}-\d{2}(?:T00:00:00(?:\.0+)?Z)?$/

const DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

export function formatContractAwardDate(value: string): string {
  const options = DATE_ONLY_OR_UTC_MIDNIGHT.test(value)
    ? { ...DISPLAY_OPTIONS, timeZone: 'UTC' }
    : DISPLAY_OPTIONS

  return new Intl.DateTimeFormat('en-US', options).format(new Date(value))
}
