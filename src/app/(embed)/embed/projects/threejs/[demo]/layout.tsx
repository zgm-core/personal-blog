export default function EmbedDemoLayout({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 overflow-hidden bg-[#001111]">{children}</div>
}
