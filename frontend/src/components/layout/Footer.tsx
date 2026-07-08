import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
                <Sparkles size={16} />
              </span>
              {APP_NAME}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Tailor your resume and cover letter to any job in seconds, backed by AI that
              understands what recruiters and ATS systems actually look for.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{section}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Built with React, TypeScript &amp; Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
}
