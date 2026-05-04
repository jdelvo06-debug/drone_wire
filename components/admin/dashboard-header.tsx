'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, RefreshCw, LogOut, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardHeader() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <LayoutDashboard className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your DroneWire content and engagement
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/systems">
            <ImageIcon className="w-4 h-4 mr-2" />
            System Images
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
