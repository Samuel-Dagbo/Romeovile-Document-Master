'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
