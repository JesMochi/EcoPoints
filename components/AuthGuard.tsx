"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import type { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(profile.role)) {
      const dest =
        profile.role === "centro_acopio"
          ? "/centro"
          : profile.role === "admin"
          ? "/admin"
          : "/dashboard";
      router.replace(dest);
    }
  }, [profile, loading, router, allowedRoles]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-eco-50">
        <div className="flex items-center gap-2 text-eco-600">
          <Leaf className="h-6 w-6 animate-pulse" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) return null;

  return <>{children}</>;
}
