import type { Metadata } from "next";

import { notFound } from "next/navigation";

import AdminDashboard from "@/components/admin/AdminDashboard";
import Nav from "@/components/Nav";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Panel de gastos",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // El panel solo existe en /admin, sin versiones en otros idiomas.
  if ((await getLocale()) !== DEFAULT_LOCALE) notFound();
  return (
    <>
      <Nav />
      <main className="flex-1 bg-paper px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <AdminDashboard />
      </main>
    </>
  );
}
