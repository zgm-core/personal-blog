/**
 * 手动实现 pliny/utils/contentlayer 中的函数，避免 Next.js 16 的 TypeScript 模块解析问题。
 * 来源：https://github.com/timlrx/pliny/blob/master/src/utils/contentlayer.ts
 */

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>

function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = Object.assign({}, obj)
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

function dateSortDesc(a: string, b: string): -1 | 1 | 0 {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function sortPosts<T extends { date: string }>(allBlogs: T[], dateKey = 'date'): T[] {
  return [...allBlogs].sort((a, b) => dateSortDesc(a[dateKey as keyof T] as string, b[dateKey as keyof T] as string))
}

export function coreContent<T extends Record<string, unknown>>(content: T): CoreContent<T> {
  return omit(content, ['body', '_raw', '_id'] as (keyof T)[]) as CoreContent<T>
}

const isProduction = process.env.NODE_ENV === 'production'

export function allCoreContent<T extends Record<string, unknown>>(contents: T[]): CoreContent<T>[] {
  if (isProduction) {
    return contents
      .map((c) => coreContent(c))
      .filter((c) => !('draft' in c && c.draft === true))
  }
  return contents.map((c) => coreContent(c))
}
