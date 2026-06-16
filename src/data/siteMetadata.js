/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: '墨痕的个人博客',
  author: 'zgm',
  headerTitle: '墨痕@雨声碎',
  description: '记录学习与成长的个人博客',
  language: 'zh-cn',
  theme: 'system', // system, dark or light
  siteUrl: 'https://zgm-core.github.io/personal-blog',
  siteRepo: 'https://github.com/zgm-core/personal-blog',
  siteLogo: '/static/images/logo1.png',
  socialBanner: '/static/images/twitter-card.png',
  mastodon: '',
  email: '',
  github: 'https://github.com/zgm-core',
  x: '',
  // twitter: 'https://twitter.com/Twitter',
  facebook: '',
  youtube: '',
  linkedin: '',
  threads: '',
  instagram: '',
  medium: '',
  bluesky: '',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/search.json',
    },
  },
}

module.exports = siteMetadata
