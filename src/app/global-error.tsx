'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="zh">
      <body className="bg-white dark:bg-gray-950">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">出错了</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">抱歉，页面发生了意外错误。</p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            请刷新页面重试
          </button>
        </div>
      </body>
    </html>
  )
}
