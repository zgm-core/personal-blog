'use client'

const LS_LIKES = 'blog_likes'
const LS_VIEWS = 'blog_views'
const LS_USER_LIKED = 'blog_user_liked'

function read(key: string): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch {
    return {}
  }
}

function write(key: string, data: Record<string, number>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

export function getLikes(slug: string): number {
  return read(LS_LIKES)[slug] || 0
}

export function getViews(slug: string): number {
  return read(LS_VIEWS)[slug] || 0
}

export function addView(slug: string): number {
  const data = read(LS_VIEWS)
  data[slug] = (data[slug] || 0) + 1
  write(LS_VIEWS, data)
  return data[slug]
}

export function addLike(slug: string): number {
  const likes = read(LS_LIKES)
  likes[slug] = (likes[slug] || 0) + 1
  write(LS_LIKES, likes)

  const userLiked = read(LS_USER_LIKED)
  userLiked[slug] = 1
  write(LS_USER_LIKED, userLiked)

  return likes[slug]
}

export function toggleLike(slug: string): { liked: boolean; count: number } {
  const userLiked = read(LS_USER_LIKED)
  const likes = read(LS_LIKES)

  if (userLiked[slug]) {
    // unlike
    userLiked[slug] = 0
    likes[slug] = Math.max((likes[slug] || 1) - 1, 0)
  } else {
    // like
    userLiked[slug] = 1
    likes[slug] = (likes[slug] || 0) + 1
  }

  write(LS_USER_LIKED, userLiked)
  write(LS_LIKES, likes)

  return { liked: !!userLiked[slug], count: likes[slug] }
}

export function hasUserLiked(slug: string): boolean {
  return !!read(LS_USER_LIKED)[slug]
}
