export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 32 32" aria-hidden="true" className={small ? "size-6" : "size-8"}>
        <rect width="32" height="32" rx="9" fill="#6C3CE1" />
        {/* Dos flechas en círculo: reutilizar */}
        <path d="M10 17a6 6 0 0 1 10.2-4.3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M22 15a6 6 0 0 1-10.2 4.3" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M20.6 9.6v3.6h-3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.4 22.4v-3.6h3.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-display font-bold tracking-tight text-alter-500 ${small ? "text-lg" : "text-2xl"}`}>Alter</span>
    </span>
  );
}
