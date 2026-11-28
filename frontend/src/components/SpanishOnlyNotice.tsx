import { Languages } from "lucide-react";

/**
 * Aviso de que el texto que sigue solo está en castellano (guías y textos legales en los demás
 * idiomas). En castellano el texto del diccionario está vacío y no se pinta nada.
 */
export default function SpanishOnlyNotice({ text, className = "" }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <p className={`flex items-start gap-2.5 rounded-2xl bg-paper px-4 py-3 text-sm leading-relaxed text-ink-2 ${className}`}>
      <Languages className="mt-0.5 size-4 shrink-0 text-alter-500" aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}
