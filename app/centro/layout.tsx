import { AuthGuard } from "@/components/AuthGuard";

export default function CentroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["centro_acopio", "admin"]}>
      {children}
    </AuthGuard>
  );
}
