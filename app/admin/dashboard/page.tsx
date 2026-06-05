import { redirect } from "next/navigation";
import { getAdminPath } from "@/lib/admin-path";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { DashboardContainer } from "@/components/admin/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Validate token server-side before showing page content
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(getAdminPath());
  }

  return (
    <div className="admin-portal min-h-screen bg-slate-50 pb-10 text-slate-950">
      <DashboardContainer />
    </div>
  );
}
