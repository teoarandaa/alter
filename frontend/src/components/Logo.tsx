/** Logo de Alter: la palabra en el violeta de la marca. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[21px] font-semibold tracking-[-0.02em] text-alter-500 ${className}`}>Alter</span>
  );
}

/** Símbolo de Alter: la «A» con flecha en violeta, sin fondo (alter-a-violeta.svg). */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path
        d="M7.6 24.6 L16 7.6 L24.4 24.6"
        fill="none"
        stroke="#6C3CE1"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.3 20.2 H15.6 M17.6 18.2 L15.6 20.2 L17.6 22.2"
        fill="none"
        stroke="#6C3CE1"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
