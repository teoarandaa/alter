"use client";

import { useEffect } from "react";

import { wakeBackend } from "@/lib/api";

const STORAGE_KEY = "alter:backend-warmed-at";
/** El backend se apaga tras 15 minutos sin uso: no hace falta avisarle más a menudo que esto. */
const INTERVAL_MS = 10 * 60 * 1000;
/** Robots y herramientas de medición no buscan: no tiene sentido despertar el backend por ellos. */
const BOT_UA = /bot|crawl|spider|slurp|lighthouse|headless|inspectiontool/i;

/**
 * Al abrir cualquier página, avisa al backend para que vaya arrancando mientras el usuario
 * escribe o pega el enlace. Se hace en un momento libre del navegador para no restar velocidad.
 */
export default function BackendWarmup() {
  useEffect(() => {
    if (BOT_UA.test(navigator.userAgent)) return;

    try {
      const last = Number(sessionStorage.getItem(STORAGE_KEY));
      if (last && Date.now() - last < INTERVAL_MS) return;
    } catch {
      /* sin sessionStorage (modo privado estricto): se avisa igualmente */
    }

    // La hora se guarda al enviar el aviso, no al programarlo: si el efecto se cancela antes
    // (p. ej. al cambiar de página enseguida), el siguiente lo vuelve a intentar.
    const ping = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* ídem */
      }
      wakeBackend();
    };

    // Safari antiguo no tiene requestIdleCallback: ahí basta con esperar un poco.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(ping, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(ping, 1500);
    return () => clearTimeout(id);
  }, []);

  return null;
}
