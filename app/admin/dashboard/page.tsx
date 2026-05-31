import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { DashboardContainer } from "@/components/admin/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Validate token server-side before showing page content
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin");
  }

  return (
    <div className="admin-dark relative min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE2] pb-12 overflow-hidden">
      {/* Film grain noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Premium background glows */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#E8A020]/8 opacity-60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] translate-x-1/2 rounded-full bg-[#6D28D9]/5 opacity-40 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <DashboardContainer />
      </div>
    </div>
  );
}
