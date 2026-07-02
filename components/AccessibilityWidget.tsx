"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Accessibility, X, ZoomOut, Sun, Film, Type, Link2 } from "lucide-react";

type FontLevel = "normal" | "lg" | "xl";

interface A11yState {
  font: FontLevel;
  highContrast: boolean;
  grayscale: boolean;
  noMotion: boolean;
  textSpacing: boolean;
  links: boolean;
}

const STORAGE_KEY = "nef-a11y";

const DEFAULT_STATE: A11yState = {
  font: "normal",
  highContrast: false,
  grayscale: false,
  noMotion: false,
  textSpacing: false,
  links: false,
};

function applyClasses(state: A11yState) {
  const html = document.documentElement;
  html.classList.remove("a11y-font-lg", "a11y-font-xl");
  if (state.font === "lg") html.classList.add("a11y-font-lg");
  if (state.font === "xl") html.classList.add("a11y-font-xl");
  html.classList.toggle("a11y-high-contrast", state.highContrast);
  html.classList.toggle("a11y-grayscale", state.grayscale);
  html.classList.toggle("a11y-no-motion", state.noMotion);
  html.classList.toggle("a11y-text-spacing", state.textSpacing);
  html.classList.toggle("a11y-links", state.links);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Carrega preferências salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as A11yState;
        setState(parsed);
        applyClasses(parsed);
      }
    } catch {}
  }, []);

  // Salva e aplica cada mudança
  const update = useCallback((patch: Partial<A11yState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      applyClasses(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Fecha com Escape e foca no trigger
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  // Foca primeiro item ao abrir
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>("button, input");
      first?.focus();
    }
  }, [open]);

  const fontLabel = state.font === "normal" ? "Normal" : state.font === "lg" ? "Grande" : "Extra grande";

  return (
    <>
      {/* Botão flutuante */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed bottom-24 right-4 z-[9990] w-12 h-12 rounded-full bg-[#CC0000] hover:bg-[#8B0000] text-white flex items-center justify-center shadow-lg shadow-[#CC0000]/30 transition-all duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Accessibility className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9991] bg-black/40"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Painel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Opções de acessibilidade"
          className="fixed bottom-40 right-4 z-[9992] w-72 bg-[#111111] border border-[#CC0000]/30 rounded-xl shadow-2xl shadow-black/60 p-5 flex flex-col gap-4"
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-[#CC0000]" aria-hidden="true" />
              <span className="font-sans text-[13px] font-bold uppercase tracking-widest text-[#F5F5F5]">
                Acessibilidade
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu de acessibilidade"
              className="text-[#606060] hover:text-[#F5F5F5] transition-colors p-1 rounded focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full h-px bg-[#CC0000]/20" aria-hidden="true" />

          {/* Tamanho da fonte */}
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#606060]">
              Tamanho do texto — <span className="text-[#A0A0A0]">{fontLabel}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => update({ font: "normal" })}
                aria-pressed={state.font === "normal"}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000] ${state.font === "normal" ? "bg-[#CC0000] text-white" : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#222222]"}`}
              >
                A
              </button>
              <button
                onClick={() => update({ font: "lg" })}
                aria-pressed={state.font === "lg"}
                className={`flex-1 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000] ${state.font === "lg" ? "bg-[#CC0000] text-white" : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#222222]"}`}
              >
                A+
              </button>
              <button
                onClick={() => update({ font: "xl" })}
                aria-pressed={state.font === "xl"}
                className={`flex-1 py-2 rounded text-base font-bold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000] ${state.font === "xl" ? "bg-[#CC0000] text-white" : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#222222]"}`}
              >
                A++
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-[#CC0000]/10" aria-hidden="true" />

          {/* Toggles */}
          {[
            { key: "highContrast" as const, label: "Alto contraste", icon: Sun },
            { key: "grayscale" as const, label: "Escala de cinza", icon: Film },
            { key: "noMotion" as const, label: "Pausar animações", icon: ZoomOut },
            { key: "textSpacing" as const, label: "Espaçamento de texto", icon: Type },
            { key: "links" as const, label: "Destacar links", icon: Link2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="switch"
              aria-checked={state[key]}
              onClick={() => update({ [key]: !state[key] })}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000] ${state[key] ? "bg-[#CC0000]/15 border border-[#CC0000]/40" : "bg-[#1A1A1A] border border-transparent hover:bg-[#222222]"}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${state[key] ? "text-[#CC0000]" : "text-[#606060]"}`} aria-hidden="true" />
                <span className={`font-sans text-[13px] ${state[key] ? "text-[#F5F5F5]" : "text-[#A0A0A0]"}`}>
                  {label}
                </span>
              </div>
              <div
                className={`w-8 h-4 rounded-full transition-colors ${state[key] ? "bg-[#CC0000]" : "bg-[#333333]"}`}
                aria-hidden="true"
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${state[key] ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </div>
            </button>
          ))}

          <div className="w-full h-px bg-[#CC0000]/10" aria-hidden="true" />

          {/* Reset */}
          <button
            onClick={() => {
              update(DEFAULT_STATE);
            }}
            className="w-full py-2 font-sans text-[11px] font-bold uppercase tracking-widest text-[#606060] hover:text-[#CC0000] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#CC0000] rounded"
          >
            Restaurar padrões
          </button>
        </div>
      )}
    </>
  );
}
