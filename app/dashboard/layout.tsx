import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["ciudadano", "admin"]}>
      <div className="flex h-screen bg-eco-50">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
