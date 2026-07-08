import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-xl2 bg-gradient-brand px-8 py-16 text-center text-white">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to tailor your next application?</h2>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          Free to try. Upload a resume and job description and get your first match score in under a minute.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-8 bg-white text-primary-700 hover:bg-white/90"
          icon={<ArrowRight size={18} />}
          onClick={() => navigate("/signup")}
        >
          Get started free
        </Button>
      </div>
    </section>
  );
}
