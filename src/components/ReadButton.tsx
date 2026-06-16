/**
 * 博客列表页"阅读"按钮 —— 三处统一使用，避免样式不同步
 */
export default function ReadButton({ gradient }: { gradient: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-[10px] font-semibold text-white shadow-sm transition-all duration-300 group-hover:gap-2 group-hover:shadow-md group-hover:scale-105`}
    >
      阅读
      <svg
        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </span>
  )
}
