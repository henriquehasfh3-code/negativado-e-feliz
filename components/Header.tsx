"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sun, Moon, Bell } from "lucide-react";
import NotificationBell from "@/components/NotificationBell"; // ✅ Trocado Skull por TrendingUp

const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Quiz", href: "/quiz" },
  { name: "Calculadora", href: "/calculadora" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

function NotificationBellMobile() {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setSupported(true);
      if (Notification.permission === "granted") setSubscribed(true);
    }
  }, []);

  const handleClick = () => {
    if (!supported || subscribed) return;
    (window.OneSignalDeferred = window.OneSignalDeferred || []).push(async (OneSignal: any) => {
      try {
        await OneSignal.User.PushSubscription.optIn();
        setTimeout(() => {
          if (OneSignal.User.PushSubscription.optedIn) setSubscribed(true);
        }, 500);
      } catch {}
    });
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 font-sans text-[15px] font-bold uppercase tracking-wider border border-[#CC0000]/30 hover:border-[#CC0000] text-[#A0A0A0] hover:text-[#F5F5F5] py-4 rounded-[4px] transition-colors"
    >
      <Bell className="w-5 h-5" fill={subscribed ? "#CC0000" : "none"} />
      {subscribed ? "Notificações ativas" : "Ativar notificações"}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const line1Variants = {
    closed: { rotate: 0, y: 0 },
    opened: { rotate: 45, y: 6 },
  };

  const line2Variants = {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  };

  const line3Variants = {
    closed: { rotate: 0, y: 0 },
    opened: { rotate: -45, y: -6 },
  };

  const drawerVariants: any = {
    closed: {
      y: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    opened: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const drawerLinkVariants = {
    closed: { opacity: 0, y: -20 },
    opened: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[9999] bg-[#080808]/90 backdrop-blur-xl border-b border-[#CC0000]/30 h-[56px] md:h-[64px] flex items-center px-6 md:px-12">
        <div className="w-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-[10000]">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-[#CC0000]"
            >
              {/* ✅ Trocado Skull por ícone financeiro */}
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider text-[#F5F5F5]">
              NEGATIVADO <span className="text-[#FFD600]">E</span> FELIZ
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name} className="relative py-2 group">
                    <Link
                      href={link.href}
                      className={`font-sans text-[13px] font-semibold uppercase tracking-widest transition-colors duration-200 ${
                        isActive
                          ? "text-[#F5F5F5]"
                          : "text-[#A0A0A0] hover:text-[#F5F5F5]"
                      }`}
                    >
                      {link.name}
                    </Link>
                    {/* ✅ Underline animado com Tailwind puro — sem style jsx */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#CC0000] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Ações Desktop */}
          <div className="hidden md:flex items-center gap-4 z-[10000]">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                aria-label="Alternar tema"
              >
                {/* ✅ Removido animate-pulse do Sol */}
                {theme === "dark" ? (
                  <Sun className="w-[24px] h-[24px]" />
                ) : (
                  <Moon className="w-[24px] h-[24px]" />
                )}
              </button>
            )}
            
            {/* NOVO: sino de notificações */}
            <NotificationBell />

            {/* ✅ Botão Assinar com link para newsletter */}
            <Link
              href="#newsletter"
              className="font-sans text-[13px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white px-4 py-2 rounded-[4px] transition-colors duration-200"
            >
              Assinar
            </Link>
          </div>

          {/* Mobile — hamburger e tema */}
          <div className="flex md:hidden items-center gap-3 z-[10000]">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? (
                  <Sun className="w-[22px] h-[22px]" />
                ) : (
                  <Moon className="w-[22px] h-[22px]" />
                )}
              </button>
            )}
            <motion.button
              animate={mobileMenuOpen ? "opened" : "closed"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col justify-between w-6 h-[14px] focus:outline-none"
              aria-label="Abrir menu"
            >
              <motion.span
                variants={line1Variants}
                className="w-6 h-[2px] bg-[#F5F5F5] block origin-left"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                variants={line2Variants}
                className="w-6 h-[2px] bg-[#F5F5F5] block"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                variants={line3Variants}
                className="w-6 h-[2px] bg-[#F5F5F5] block origin-left"
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed top-0 left-0 w-full h-screen bg-[#0A0A0A] z-[9998] pt-[100px] px-6 flex flex-col justify-between pb-10"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.name} variants={drawerLinkVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-heading text-[48px] uppercase tracking-wider block leading-none transition-colors ${
                        isActive ? "text-[#CC0000]" : "text-[#F5F5F5] hover:text-[#CC0000]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div variants={drawerLinkVariants} className="flex flex-col gap-4">
              {/* NOVO: botão de notificações no mobile */}
              <NotificationBellMobile />

              {/* ✅ Botão Assinar no mobile com link */}
              <Link
                href="#newsletter"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full font-sans text-center text-[15px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white py-4 rounded-[4px] shadow-lg transition-colors"
              >
                Assinar
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
