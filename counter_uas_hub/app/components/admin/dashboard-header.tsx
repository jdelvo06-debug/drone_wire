'use client'

import { useRouter } from 'next/navigation'
import { LayoutDashboard, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardHeader() {
  const router = useRouter()

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
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.refresh()}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  )
}
