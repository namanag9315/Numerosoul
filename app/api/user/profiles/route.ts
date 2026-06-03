import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid authorization token." }, { status: 401 });
    }

    const accessToken = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Supabase integration not fully configured." },
        { status: 503 }
      );
    }

    // Verify user JWT token with Supabase Auth Server
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.warn("Supabase auth verification failed:", errorText);
      return NextResponse.json({ message: "Invalid session or user not authenticated." }, { status: 401 });
    }

    const userData = await authResponse.json();
    const userId = userData.id;

    if (!userId) {
      return NextResponse.json({ message: "User ID not found in authentication profile." }, { status: 400 });
    }

    // Fetch user profiles (clients) filtering by auth_user_id
    const dbResponse = await fetch(
      `${supabaseUrl}/rest/v1/clients?select=id,name,email,phone,date_of_birth,notes&auth_user_id=eq.${encodeURIComponent(userId)}&order=created_at.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      throw new Error(`Failed to query database clients: ${dbError}`);
    }

    const profiles = await dbResponse.json();
    
    interface Profile {
      id: string;
      name: string;
      email?: string;
      phone?: string;
      date_of_birth?: string;
      notes?: string;
    }
    // Deduplicate profiles by name
    const uniqueProfiles = profiles.reduce((acc: Profile[], current: Profile) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return NextResponse.json(uniqueProfiles);
  } catch (error: unknown) {
    console.error("User profiles fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to load profiles.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
