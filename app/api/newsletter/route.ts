import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID) || 2],
        updateEnabled: true,
      }),
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      // Contato já existente (código 400 com duplicateParameter) é ok
      if (error.code !== "duplicate_parameter") {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter API Error]", error);
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
