"use client";

declare global {
  interface Window {
    googlefc?: { callbackQueue?: unknown[]; showRevocationMessage?: () => void };
  }
}

/**
 * Vuelve a abrir el mensaje de consentimiento de Google (Privacidad y mensajes de AdSense)
 * para que el usuario cambie o retire su consentimiento.
 */
export default function CookieSettingsButton() {
  function open() {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(() => window.googlefc?.showRevocationMessage?.());
  }

  return (
    <button
      type="button"
      onClick={open}
      className="mt-5 rounded-full bg-alter-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-alter-600"
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}
