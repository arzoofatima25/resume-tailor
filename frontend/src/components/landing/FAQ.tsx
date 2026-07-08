import { Accordion } from "@/components/ui/Accordion";

const FAQS = [
  {
    question: "What file formats can I upload?",
    answer: "You can upload PDF or DOCX files, or paste your resume text directly — no file needed.",
  },
  {
    question: "Is my resume data stored?",
    answer: "Your resume is processed to generate your analysis. History is currently kept locally in your browser.",
  },
  {
    question: "How is the match score calculated?",
    answer: "The AI compares your resume's skills, experience, and language against the job description the way an ATS and recruiter would, then returns a calibrated 0–100 score.",
  },
  {
    question: "Can I edit the generated cover letter?",
    answer: "Yes — copy it anywhere, or download it as part of your PDF report and edit freely.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
      </div>
      <div className="mt-10">
        <Accordion items={FAQS} />
      </div>
    </section>
  );
}
