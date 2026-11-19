export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-[18px]">
        <rect width="32" height="32" rx="9" fill="#6C3CE1" />
        <path d="M10 17a6 6 0 0 1 10.2-4.3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M22 15a6 6 0 0 1-10.2 4.3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M20.6 9.6v3.6h-3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.4 22.4v-3.6h3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">Alter</span>
    </span>
  );
}
