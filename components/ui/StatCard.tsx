interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-eco ${
        highlight
          ? "bg-eco-600 border-eco-600 text-white"
          : "bg-white border-eco-100"
      }`}
    >
      <div
        className={`inline-flex p-2 rounded-xl mb-3 ${
          highlight ? "bg-eco-500" : "bg-eco-50"
        }`}
      >
        <span className={highlight ? "text-white" : "text-eco-600"}>
          {icon}
        </span>
      </div>
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          highlight ? "text-eco-100" : "text-gray-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold mt-1 ${
          highlight ? "text-white" : "text-gray-800"
        }`}
      >
        {value}
        {unit && (
          <span
            className={`text-sm font-normal ml-1 ${
              highlight ? "text-eco-100" : "text-gray-400"
            }`}
          >
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
