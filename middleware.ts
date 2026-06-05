import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_ADMIN_PATH, getAdminPath, isPathWithin } from "@/lib/admin-path";

async function refreshSupabaseSession(
  request: NextRequest,
  createResponse: () => NextResponse,
) {
  let response = createResponse();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, "") || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = createResponse();
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export async function middleware(request: NextRequest) {
  const adminPath = getAdminPath();
  const pathname = request.nextUrl.pathname;

  // Protect the real /admin path if a custom path is set
  if (
    adminPath !== DEFAULT_ADMIN_PATH &&
    isPathWithin(pathname, DEFAULT_ADMIN_PATH)
  ) {
    const notFoundUrl = new URL("/_not-found", request.url);
    return refreshSupabaseSession(
      request,
      () => NextResponse.rewrite(notFoundUrl, { request }),
    );
  }

  // Rewrite the custom secret path to /admin internally
  if (adminPath !== DEFAULT_ADMIN_PATH && isPathWithin(pathname, adminPath)) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `${DEFAULT_ADMIN_PATH}${pathname.slice(adminPath.length)}`;

    return refreshSupabaseSession(
      request,
      () => NextResponse.rewrite(rewriteUrl, { request }),
    );
  }

  return refreshSupabaseSession(request, () => NextResponse.next({ request }));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
