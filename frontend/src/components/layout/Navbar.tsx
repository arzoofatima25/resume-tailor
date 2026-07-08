import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/constants";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft dark:shadow-soft-dark" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
            <Sparkles size={16} />
          </span>
          {APP_NAME}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")}>
            Get started free
          </Button>
        </div>

        <button
          className="md:hidden text-slate-700 dark:text-slate-200"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="glass md:hidden overflow-hidden px-6 pb-6"
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeSwitch />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")}>
                  Get started
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
