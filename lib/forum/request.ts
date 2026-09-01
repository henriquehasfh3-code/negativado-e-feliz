import { NextRequest } from "next/server";
import { voterKey } from "./db";

/** Chave estável por visitante, derivada de IP + user-agent. */
export function keyFromRequest(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0";
  const ua = request.headers.get("user-agent") || "unknown";
  return voterKey(ip, ua);
}

/** Limite de escrita em memória. Some a cada cold start — é um freio, não um cofre. */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

export function cleanText(s: unknown, max: number): string {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

export function validEmail(s: string): boolean {
  return s === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
