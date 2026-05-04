
'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    if (!mounted) return
    
    const currentTheme = theme || 'system'
    
    if (currentTheme === 'light') {
      setTheme('dark')
    } else if (currentTheme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }, [theme, setTheme, mounted])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="focus-ring">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const getThemeIcon = () => {
    const currentTheme = theme || 'system'
    
    if (currentTheme === 'light') {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />
    } else if (currentTheme === 'dark') {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />
    } else {
      return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="focus-ring" 
      onClick={toggleTheme}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
