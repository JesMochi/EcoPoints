import { NextResponse, type NextRequest } from "next/server";

// La autenticación se maneja client-side con useUser en cada página.
// Este middleware solo refresca las cookies de sesión de Supabase.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
