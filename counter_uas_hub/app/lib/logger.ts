/**
 * Simple logger utility for DroneWire
 *
 * Provides consistent logging with optional suppression in production.
 * Set LOG_LEVEL env var to control verbosity:
 *   - 'debug': all logs
 *   - 'info': info, warn, error (default)
 *   - 'warn': warn, error only
 *   - 'error': errors only
 *   - 'silent': no logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase() as LogLevel
  if (level && LOG_LEVELS[level] !== undefined) {
    return level
  }
  // Default to 'info' in production, 'debug' in development
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

function shouldLog(level: LogLevel): boolean {
  const currentLevel = getLogLevel()
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]
}

function formatMessage(level: string, message: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  return `${prefix} ${message}`
}

export const logger = {
  debug(message: string, ...args: unknown[]) {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', message), ...args)
    }
  },

  info(message: string, ...args: unknown[]) {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message), ...args)
    }
  },

  warn(message: string, ...args: unknown[]) {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message), ...args)
    }
  },

  error(message: string, ...args: unknown[]) {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message), ...args)
    }
  },
}

export default logger
