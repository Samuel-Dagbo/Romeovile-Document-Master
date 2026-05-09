'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard Error
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {error.message || 'Something went wrong loading the dashboard.'}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
