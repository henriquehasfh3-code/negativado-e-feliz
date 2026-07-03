import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  try {
    const { nome, email, mensagem, divida } = await request.json();

    if (!nome || !mensagem) {
      return NextResponse.json({ error: "Nome e mensagem são obrigatórios" }, { status: 400 });
    }

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        sender: {
          name: "Negativado e Feliz — Contato",
          email: "henriquehasfh3@gmail.com",
        },
        to: [{ email: "henriquehasfh3@gmail.com", name: "Henrique" }],
        subject: `Novo desabafo de ${nome}`,
        htmlContent: `
          <h2>Novo contato pelo site</h2>
          <p><strong>Nome:</strong> ${escape(nome)}</p>
          <p><strong>E-mail:</strong> ${email ? escape(email) : "não informado"}</p>
          <p><strong>Faixa de dívida:</strong> ${escape(divida)}</p>
          <hr/>
          <blockquote style="border-left: 4px solid #CC0000; padding-left: 16px; color: #333;">
            ${escape(mensagem)}
          </blockquote>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contato API Error]", error);
    return NextResponse.json({ error: "Falha ao enviar" }, { status: 500 });
  }
}
