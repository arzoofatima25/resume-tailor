import { Card } from "@/components/ui/Card";

const BENEFITS = [
  { stat: "3x", label: "More interview callbacks reported by tailored applicants" },
  { stat: "<60s", label: "Average time to generate a full analysis" },
  { stat: "6", label: "AI outputs from a single resume + job description" },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-6 sm:grid-cols-3">
        {BENEFITS.map((b) => (
          <Card key={b.label} glass animate className="text-center">
            <p className="font-display text-4xl font-bold bg-gradient-brand bg-clip-text text-transparent">
              {b.stat}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{b.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
