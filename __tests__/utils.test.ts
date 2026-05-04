import { cn, formatDuration } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('merges conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('formatDuration', () => {
  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('00:00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('00:02:05')
  })

  it('formats hours, minutes and seconds', () => {
    expect(formatDuration(3661)).toBe('01:01:01')
  })

  it('formats large durations', () => {
    expect(formatDuration(36000)).toBe('10:00:00')
  })
})
