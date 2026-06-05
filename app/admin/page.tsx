"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Loader2, ShieldCheck } from "lucide-react";
import { getAdminPath } from "@/lib/admin-path";
import { supabase } from "@/lib/supabase-client";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const redirectAdmin = async (email?: string) => {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (email === adminEmail) {
        router.replace(`${getAdminPath()}/dashboard`);
        return;
      }

      if (!mounted) return;
      setError("Access denied. Please sign in with the configured admin account.");
      await supabase.auth.signOut();
      setLoading(false);
    };

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await redirectAdmin(session.user.email);
      } else {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        void redirectAdmin(session.user.email);
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${getAdminPath()}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="admin-portal min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_440px]">
          <div className="hidden border-r border-slate-200 bg-slate-100/70 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Admin workspace
              </div>
              <h1 className="mt-8 max-w-xl font-sans text-4xl font-bold leading-tight tracking-normal text-slate-950">
                NumeroSoul operations, clear and easy to scan.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                Manage bookings, clients, services, campaigns, billing, and numerology reports from one focused workspace.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-700">
              {["High-contrast light interface", "Persistent secure session", "Built for desktop and mobile admin use"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-700">
                <Lock className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">NumeroSoul</p>
                <h2 className="font-sans text-2xl font-bold leading-tight tracking-normal text-slate-950">
                  Admin sign in
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              Continue with the authorized Google account. Your session will stay remembered on this device until you log out.
            </p>

            {error && (
              <div
                className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-800"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              aria-busy={loading}
              className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Checking session
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3 text-left">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                <p className="text-sm leading-6 text-slate-600">
                  Protected by Supabase Auth with server-side admin authorization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
