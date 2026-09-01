"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, BarChart3, Check } from "lucide-react";

// ─── Votos em tópico / resposta ──────────────────────────────────────────────

export function VoteButtons({
  targetKind,
  targetId,
  initialScore,
}: {
  targetKind: "thread" | "reply";
  targetId: number;
  initialScore: number;
}) {
  const [score, setScore] = useState(initialScore);
  const [mine, setMine] = useState<0 | 1 | -1>(0);
  const [busy, setBusy] = useState(false);

  async function vote(value: 1 | -1) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/forum/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetKind, targetId, value }),
      });
      const data = await res.json();
      if (typeof data.score === "number") {
        setScore(data.score);
        setMine((prev) => (prev === value ? 0 : value));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-0.5 select-none">
      <button
        onClick={() => vote(1)}
        aria-label="Votar a favor"
        className={`p-1 rounded transition-colors ${
          mine === 1 ? "text-[#CC0000]" : "text-[#606060] hover:text-[#A0A0A0]"
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <span
        className={`font-sans text-sm font-bold tabular-nums ${
          score > 0 ? "text-[#CC0000]" : score < 0 ? "text-[#606060]" : "text-[#A0A0A0]"
        }`}
      >
        {score}
      </span>
      <button
        onClick={() => vote(-1)}
        aria-label="Votar contra"
        className={`p-1 rounded transition-colors ${
          mine === -1 ? "text-[#CC0000]" : "text-[#606060] hover:text-[#A0A0A0]"
        }`}
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}

// ─── Enquete ─────────────────────────────────────────────────────────────────

interface Option {
  id: number;
  label: string;
  vote_count: number;
}

export function PollWidget({
  pollId,
  question,
  options: initial,
}: {
  pollId: number;
  question: string;
  options: Option[];
}) {
  const [options, setOptions] = useState(initial);
  const [voted, setVoted] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const total = options.reduce((s, o) => s + o.vote_count, 0);

  async function vote(optionId: number) {
    if (busy || voted !== null) return;
    setBusy(true);
    try {
      const res = await fetch("/api/forum/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "poll", pollId, optionId }),
      });
      const data = await res.json();
      if (data.counted) {
        setOptions((prev) =>
          prev.map((o) => (o.id === optionId ? { ...o, vote_count: o.vote_count + 1 } : o)),
        );
        setVoted(optionId);
      } else {
        setVoted(-1); // já tinha votado: revela o resultado mesmo assim
      }
      setMsg(data.message ?? "");
    } finally {
      setBusy(false);
    }
  }

  const revealed = voted !== null;

  return (
    <div className="rounded-xl border border-[#CC0000]/25 bg-[#111111] p-6 my-8">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-[#CC0000]" />
        <h3 className="font-heading text-[22px] text-[#F5F5F5]">{question}</h3>
      </div>

      <div className="space-y-2.5">
        {options.map((o) => {
          const pct = total > 0 ? Math.round((o.vote_count / total) * 100) : 0;
          const isMine = voted === o.id;
          return (
            <button
              key={o.id}
              onClick={() => vote(o.id)}
              disabled={revealed || busy}
              className={`relative w-full text-left rounded-lg border overflow-hidden transition-all ${
                revealed
                  ? "border-[#CC0000]/20 cursor-default"
                  : "border-[#CC0000]/20 hover:border-[#CC0000]/60 cursor-pointer"
              }`}
            >
              {revealed && (
                <div
                  className="absolute inset-y-0 left-0 bg-[#CC0000]/20 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-3">
                <span className="font-sans text-sm text-[#F5F5F5] flex items-center gap-2">
                  {isMine && <Check className="w-4 h-4 text-[#CC0000]" />}
                  {o.label}
                </span>
                {revealed && (
                  <span className="font-sans text-sm font-bold text-[#A0A0A0] tabular-nums">
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 font-sans text-xs text-[#606060]">
        {total} {total === 1 ? "voto" : "votos"}
        {msg && ` · ${msg}`}
      </p>
    </div>
  );
}
