import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Permite ler o token por query parameter (?secret=...) ou header x-revalidate-secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret") || request.headers.get("x-revalidate-secret");
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error("[Revalidation API] REVALIDATE_SECRET não está configurado nas variáveis de ambiente.");
      return NextResponse.json(
        { message: "Segredo de revalidação não configurado no servidor." },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn("[Revalidation API] Tentativa de revalidação com token inválido.");
      return NextResponse.json({ message: "Token inválido." }, { status: 401 });
    }

    // Força a revalidação dos caminhos estáticos
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]");

    console.log("[Revalidation API] Revalidação concluída com sucesso para os caminhos /, /blog e /blog/[slug]");

    return NextResponse.json({
      revalidated: true,
      message: "Caminhos revalidados com sucesso.",
      now: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Revalidation API ERROR] Falha ao processar revalidação:", error);
    return NextResponse.json(
      { message: "Erro interno ao revalidar caminhos.", error: error.message },
      { status: 500 }
    );
  }
}
