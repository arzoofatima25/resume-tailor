import { Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Placeholder testimonials — swap with real customer quotes before launch.
const TESTIMONIALS = [
  { name: "Placeholder — Job Seeker", role: "Software Engineer", quote: "Placeholder testimonial text goes here once real customer feedback is collected." },
  { name: "Placeholder — Job Seeker", role: "Product Manager", quote: "Placeholder testimonial text goes here once real customer feedback is collected." },
  { name: "Placeholder — Job Seeker", role: "Data Analyst", quote: "Placeholder testimonial text goes here once real customer feedback is collected." },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-white/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What job seekers are saying</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Placeholder section — replace with real testimonials.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} animate>
              <Quote size={22} className="text-primary-300 dark:text-primary-500/40" />
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t.quote}</p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
