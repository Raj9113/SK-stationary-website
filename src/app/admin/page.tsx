import { redirect } from "next/navigation";

import { getAdminAccess } from "@/lib/admin-auth";
import AdminDashboardClient from "./AdminDashboardClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const access = await getAdminAccess();

  if (!access.authorized) {
    redirect(access.reason === "unauthenticated" ? "/account/login" : "/");
  }

  return <AdminDashboardClient />;
}
