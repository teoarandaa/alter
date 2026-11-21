import type { Metadata } from "next";

import AdminDashboard from "@/components/admin/AdminDashboard";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Panel de gastos",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-paper px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <AdminDashboard />
      </main>
    </>
  );
}
