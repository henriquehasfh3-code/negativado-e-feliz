"use client";

import { useState, useEffect } from "react";
import { Check, Link2 } from "lucide-react";
import { generateShareUrl } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  coverUrl?: string;
}

export default function ShareButtons({ url, title, coverUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    setFullUrl(`${window.location.origin}${url}`);
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar link:", err);
    }
  };

  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - ${fullUrl}`
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(fullUrl)}`,
  };

  return (
    <>
      {/* ─── DESKTOP SIDEBAR STICKY (> 1200px) ─────────────────────────────────── */}
      <aside className="hidden xl:flex fixed left-4 top-[240px] flex-col gap-4 z-40 items-center justify-center p-2 bg-[#111111]/80 backdrop-blur-xl border border-[#CC0000]/20 rounded-full shadow-lg shadow-[#CC0000]/20">
        <span className="font-sans text-[9px] font-bold text-[#606060] uppercase tracking-widest rotate-[-90deg] my-4 select-none">
          Compartilhar
        </span>

        {/* WhatsApp Button (Green) */}
        <a
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all duration-200"
          title="Compartilhar no WhatsApp"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.117.957 11.5.957c-5.442 0-9.87 4.372-9.873 9.802-.001 1.77.469 3.5 1.36 5.048L1.9 21.2l5.447-1.424z" />
          </svg>
        </a>

        {/* Twitter/X Button (White) */}
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-200"
          title="Compartilhar no Twitter/X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Pinterest Button (Red) */}
        <a
          href={generateShareUrl("pinterest", fullUrl, title, coverUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E60023]/10 text-[#E60023] border border-[#E60023]/20 hover:bg-[#E60023] hover:text-white transition-all duration-200"
          title="Compartilhar no Pinterest"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </a>

        {/* Copy Link Button (Yellow) */}
        <button
          onClick={handleCopy}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            copied
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20 hover:bg-[#FFD600] hover:text-[#080808]"
          }`}
          title="Copiar Link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
      </aside>

      {/* ─── MOBILE FIXED BAR (BOTTOM WITH BLUR) ──────────────────────────────── */}
      <div className="xl:hidden fixed bottom-0 left-0 w-full z-[9990] bg-[#080808]/80 backdrop-blur-md border-t border-[#CC0000]/20 py-3 px-6 flex items-center justify-between">
        <span className="font-sans text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
          Curtiu? Compartilha:
        </span>
        
        <div className="flex items-center gap-4">
          {/* WhatsApp Mobile */}
          <a
            href={shareUrls.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-sm"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.117.957 11.5.957c-5.442 0-9.87 4.372-9.873 9.802-.001 1.77.469 3.5 1.36 5.048L1.9 21.2l5.447-1.424z" />
            </svg>
          </a>

          {/* Twitter Mobile */}
          <a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-black shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Pinterest Mobile */}
          <a
            href={generateShareUrl("pinterest", fullUrl, title, coverUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#E60023] text-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
          </a>

          {/* Copy Link Mobile */}
          <button
            onClick={handleCopy}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-[#FFD600] text-black"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
