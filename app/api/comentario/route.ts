import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, comentario, postTitle, postSlug } = await request.json();

    if (!nome || !comentario) {
      return NextResponse.json({ error: "Nome e comentário são obrigatórios" }, { status: 400 });
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
          name: "Negativado e Feliz — Comentários",
          email: "noreply@negativadoefeliz.com.br",
        },
        to: [{ email: "henriquehasfh3@gmail.com", name: "Henrique" }],
        subject: `Novo comentário em "${postTitle}"`,
        htmlContent: `
          <h2>Novo comentário no blog</h2>
          <p><strong>Artigo:</strong> ${postTitle}</p>
          <p><strong>Link:</strong> https://negativadoefeliz.com.br/blog/${postSlug}</p>
          <hr/>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email || "não informado"}</p>
          <hr/>
          <blockquote style="border-left: 4px solid #CC0000; padding-left: 16px; color: #333;">
            ${comentario}
          </blockquote>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Comentario API Error]", error);
    return NextResponse.json({ error: "Falha ao enviar comentário" }, { status: 500 });
  }
}
