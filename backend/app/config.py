"""Configuración de Alter leída de variables de entorno (.env)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "si", "sí", "on"}


@dataclass(frozen=True)
class Settings:
    anthropic_api_key: str | None = field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY") or None)
    claude_model: str = field(default_factory=lambda: os.getenv("CLAUDE_MODEL", "claude-opus-5-5"))
    apify_token: str | None = field(default_factory=lambda: os.getenv("APIFY_TOKEN") or None)
    # Modo demo: devuelve resultados de ejemplo sin llamar a Apify.
    # Se activa solo si no hay token de Apify, o forzándolo con ALTER_DEMO_MODE=1.
    force_demo: bool = field(default_factory=lambda: _bool(os.getenv("ALTER_DEMO_MODE")))
    max_results_per_platform: int = field(default_factory=lambda: int(os.getenv("ALTER_MAX_RESULTS", "12")))
    apify_timeout_s: float = field(default_factory=lambda: float(os.getenv("ALTER_APIFY_TIMEOUT", "120")))
    # El plan gratuito de Apify admite 5 ejecuciones a la vez y 16 GB de memoria en total.
    apify_max_concurrency: int = field(default_factory=lambda: int(os.getenv("ALTER_APIFY_MAX_CONCURRENCY", "4")))
    allowed_origins: list[str] = field(
        default_factory=lambda: [
            o.strip() for o in os.getenv("ALTER_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()
        ]
    )
    platforms_file: Path = field(default_factory=lambda: BASE_DIR / "platforms.json")

    # Panel privado de gastos (/admin). Sin ALTER_ADMIN_TOKEN el panel está desactivado.
    admin_token: str | None = field(default_factory=lambda: os.getenv("ALTER_ADMIN_TOKEN") or None)
    # Clave de administración de Anthropic (sk-ant-admin...), solo para leer el gasto en Claude.
    anthropic_admin_key: str | None = field(default_factory=lambda: os.getenv("ANTHROPIC_ADMIN_KEY") or None)
    # Sal secreta para contar usuarios únicos sin guardar IPs (si falta, se deriva de APIFY_TOKEN).
    usage_salt: str | None = field(default_factory=lambda: os.getenv("ALTER_USAGE_SALT") or None)

    @property
    def demo_mode(self) -> bool:
        return self.force_demo or not self.apify_token

    @property
    def ai_enabled(self) -> bool:
        return bool(self.anthropic_api_key)


settings = Settings()
