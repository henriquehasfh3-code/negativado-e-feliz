"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, CheckCircle } from "lucide-react";

interface CommentFormProps {
  postTitle: string;
  postSlug: string;
}

export default function CommentForm({ postTitle, postSlug }: CommentFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comentario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, comentario, postTitle, postSlug }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");
      setSubmitted(true);
    } catch {
      setError("Deu ruim no envio. Tenta de novo, vai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t border-[#CC0000]/20 pt-10">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-[#CC0000]" />
        <h3 className="font-heading text-[28px] text-[#F5F5F5]">
          Deixe seu Desabafo
        </h3>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl px-6 py-5"
        >
          <CheckCircle className="w-5 h-5 text-[#CC0000] flex-shrink-0" />
          <p className="font-sans text-sm text-[#CC0000] font-semibold">
            Desabafo recebido! A redação vai ler isso enquanto paga os próprios boletos.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                Nome <span className="text-[#CC0000]">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome ou apelido"
                required
                className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                E-mail <span className="text-[#606060] font-normal normal-case tracking-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Para respondermos (opcional)"
                className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
              Comentário <span className="text-[#CC0000]">*</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que você achou? Tem alguma história parecida?"
              required
              rows={4}
              className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060] resize-none"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-[#CC0000]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#8B0000] disabled:opacity-50 text-white font-sans text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "Enviando..." : "Enviar Comentário"}
          </button>

          <p className="font-sans text-[11px] text-[#606060]">
            Seus dados não são compartilhados. Comentários passam por moderação antes de aparecer no site.
          </p>
        </form>
      )}
    </div>
  );
}
