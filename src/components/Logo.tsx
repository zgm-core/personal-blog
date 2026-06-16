const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    className="h-6 w-6"
  >
    <defs>
      <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#fdf2f8" />
      </linearGradient>
      <linearGradient id="logo-accent" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>

    {/* 背景圆 —— 柔和光晕 */}
    <circle cx="16" cy="16" r="15" fill="url(#logo-grad)" opacity="0.15" />
    <circle cx="16" cy="16" r="10" fill="url(#logo-accent)" opacity="0.08" />

    {/* 墨 字造型：上方雨字头 + 下方土 */}
    {/* 雨字头 — 顶部横 */}
    <path
      d="M9 11h14"
      stroke="url(#logo-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 雨字头 — 左点 */}
    <path
      d="M10.5 6.5v5.5"
      stroke="url(#logo-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 雨字头 — 右点 */}
    <path
      d="M21.5 6.5v5.5"
      stroke="url(#logo-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 中间竖贯穿 */}
    <path
      d="M16 10v15"
      stroke="url(#logo-accent)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* 底部横 = 土 */}
    <path
      d="M9 24h14"
      stroke="url(#logo-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* 右下角点缀小点 */}
    <circle cx="24" cy="23" r="1.2" fill="#f472b6" opacity="0.8" />
  </svg>
)

export default Logo
