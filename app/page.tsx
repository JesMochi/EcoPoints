import Link from "next/link";
import { Leaf, Recycle, Trophy, Gift } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-eco-100">
          <Leaf className="h-10 w-10 text-eco-600" />
        </div>
        <h1 className="mb-4 text-5xl font-bold text-eco-800 md:text-6xl">
          EcoPoints
        </h1>
        <p className="mb-2 text-xl font-medium text-eco-600">
          Recicla. Gana puntos. Transforma tu comunidad.
        </p>
        <p className="mb-10 max-w-xl text-gray-500">
          La plataforma de gamificación de reciclaje que conecta ciudadanos con
          centros de acopio y premia tu impacto ambiental.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-eco-600 px-8 py-3 text-white font-semibold shadow-eco hover:bg-eco-700 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-eco-600 px-8 py-3 text-eco-700 font-semibold hover:bg-eco-50 transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Recycle className="h-7 w-7 text-eco-600" />}
            title="Escanea y recicla"
            description="Escanea el QR del centro de acopio, registra tu reciclaje y gana puntos al instante."
          />
          <FeatureCard
            icon={<Trophy className="h-7 w-7 text-eco-600" />}
            title="Ranking en tiempo real"
            description="Compite con tu comunidad. Sube al leaderboard y conviértete en el campeón del reciclaje."
          />
          <FeatureCard
            icon={<Gift className="h-7 w-7 text-eco-600" />}
            title="Canjea recompensas"
            description="Usa tus puntos para obtener recompensas reales: despensas, descuentos y más."
          />
        </div>
      </section>

      <footer className="border-t border-eco-100 py-6 text-center text-sm text-gray-400">
        EcoPoints · HackaTec 2026 · InnovaTecNM
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-eco-100 bg-white p-6 shadow-sm hover:shadow-eco transition-shadow">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-eco-50">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
