/** Logo de Alter: la palabra en el violeta de la marca (el icono de la «A» se usa como favicon). */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[17px] font-semibold tracking-[-0.02em] text-alter-500 ${className}`}>Alter</span>
  );
}
