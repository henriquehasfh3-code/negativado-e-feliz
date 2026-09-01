"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, CheckCircle, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "Geral",
  "Dívidas",
  "Crédito e Score",
  "Sobrevivência",
  "Investimentos",
  "Renda Extra",
  "Consumo",
];

const inputCls =
  "w-full px-4 py-3 rounded-lg border border-[#CC0000]/20 bg-[#0d0d0d] text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-all";

function Feedback({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-5 py-4 border ${
        ok
          ? "bg-[#CC0000]/10 border-[#CC0000]/30"
          : "bg-[#3a2000]/40 border-[#E0A526]/30"
      }`}
    >
      {ok ? (
        <CheckCircle className="w-5 h-5 text-[#CC0000] shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-[#E0A526] shrink-0 mt-0.5" />
      )}
      <p className="font-sans text-sm text-[#F5F5F5]">{text}</p>
    </div>
  );
}

// ─── Novo tópico ─────────────────────────────────────────────────────────────

export function NewThreadForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Geral");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/forum/thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          category,
          authorName: name,
          authorEmail: email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, text: data.error ?? "Deu ruim no envio." });
        return;
      }
      setResult({ ok: data.published, text: data.message });
      setTitle("");
      setBody("");
      if (data.published) {
        setTimeout(() => router.push(`/forum/${data.slug}`), 900);
      }
    } catch {
      setResult({ ok: false, text: "Deu ruim no envio. Tenta de novo." });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-[#CC0000]/40 bg-[#111111] px-6 py-5 text-left font-sans text-sm text-[#A0A0A0] hover:border-[#CC0000] hover:text-[#F5F5F5] transition-all"
      >
        Abrir um tópico novo — desabafo, dúvida ou relato.
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-[#CC0000]/20 bg-[#111111] p-6 space-y-4">
      <h3 className="font-heading text-[24px] text-[#F5F5F5]">Novo tópico</h3>

      <input
        className={inputCls}
        placeholder="Título — o que você quer discutir?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={140}
        required
      />

      <textarea
        className={`${inputCls} min-h-[140px] resize-y`}
        placeholder="Conta o caso. Quanto mais concreto, melhor a conversa."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={5000}
        required
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <select
          className={inputCls}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className={inputCls}
          placeholder="Seu nome (ou apelido)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <input
          className={inputCls}
          type="email"
          placeholder="E-mail (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={120}
        />
      </div>

      {result && <Feedback ok={result.ok} text={result.text} />}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-[#a30000] disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
          {loading ? "Enviando..." : "Publicar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-sm text-[#606060] hover:text-[#A0A0A0]"
        >
          Cancelar
        </button>
      </div>

      <p className="font-sans text-xs text-[#606060]">
        Nunca publique CPF, número de conta, cartão ou senha. Post com dado pessoal é retido.
      </p>
    </form>
  );
}

// ─── Resposta ────────────────────────────────────────────────────────────────

export function ReplyForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [askAi, setAskAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/forum/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body, authorName: name, authorEmail: email, askAi }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, text: data.error ?? "Deu ruim no envio." });
        return;
      }
      setResult({
        ok: data.published,
        text: data.aiReplied ? `${data.message} O robô respondeu.` : data.message,
      });
      setBody("");
      if (data.published) setTimeout(() => router.refresh(), 800);
    } catch {
      setResult({ ok: false, text: "Deu ruim no envio. Tenta de novo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-[#CC0000]/20 bg-[#111111] p-6 space-y-4 mt-10"
    >
      <h3 className="font-heading text-[22px] text-[#F5F5F5]">Responder</h3>

      <textarea
        className={`${inputCls} min-h-[110px] resize-y`}
        placeholder="Sua resposta..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={4000}
        required
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputCls}
          placeholder="Seu nome (ou apelido)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
        <input
          className={inputCls}
          type="email"
          placeholder="E-mail (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={120}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={askAi}
          onChange={(e) => setAskAi(e.target.checked)}
          className="mt-1 accent-[#CC0000] w-4 h-4"
        />
        <span className="font-sans text-sm text-[#A0A0A0] group-hover:text-[#F5F5F5] transition-colors">
          <Bot className="inline w-4 h-4 text-[#CC0000] mr-1 -mt-0.5" />
          Quero que o robô do fórum comente também
        </span>
      </label>

      {result && <Feedback ok={result.ok} text={result.text} />}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-[#CC0000] px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-[#a30000] disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
        {loading ? "Enviando..." : "Responder"}
      </button>
    </form>
  );
}
