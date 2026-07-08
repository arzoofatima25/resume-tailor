import { Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Placeholder testimonials — swap with real customer quotes before launch.
const TESTIMONIALS = [
  {
    name: "Resume Match Analysis",
    role: "ATS-ready insights",
    quote: "Compare your resume with a job description and get a clear match score with improvement areas.",
  },
  {
    name: "Missing Skills Detection",
    role: "Skill gap finder",
    quote: "Find important skills from the job post that are missing or weak in your resume.",
  },
  {
    name: "Cover Letter Generator",
    role: "Tailored applications",
    quote: "Generate a personalized cover letter based on your resume and the target job description.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-white/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Built for faster job applications</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Tailorly helps candidates improve resume-job matching, identify missing skills, and generate tailored cover letters.</p>
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
