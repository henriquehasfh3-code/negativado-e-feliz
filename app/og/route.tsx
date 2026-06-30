import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function loadBebasNeue() {
  const response = await fetch(
    "https://fonts.gstatic.com/s/bebasneue/v16/JTUSjIg69CK48gW7PXooxW4.ttf"
  );
  return response.arrayBuffer();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Negativado e Feliz";
  const category = searchParams.get("category") || "Finanças";

  const bebasNeue = await loadBebasNeue();

  // Truncar título muito longo para não transbordar
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const fontSize = title.length > 60 ? 56 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          position: "relative",
          fontFamily: "'Bebas Neue'",
        }}
      >
        {/* Linha vermelha no topo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#CC0000",
          }}
        />

        {/* Ruído de fundo sutil — grid de pontos */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, #CC000015 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Badge de categoria */}
        <div
          style={{
            background: "#CC0000",
            color: "white",
            fontSize: "15px",
            fontFamily: "'Bebas Neue'",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            padding: "6px 16px",
            marginBottom: "20px",
            alignSelf: "flex-start",
          }}
        >
          {category}
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: "'Bebas Neue'",
            fontWeight: "400",
            color: "#F5F5F5",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            marginBottom: "36px",
            wordBreak: "break-word",
          }}
        >
          {displayTitle}
        </div>

        {/* Rodapé */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{ width: "40px", height: "4px", background: "#CC0000" }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "'Bebas Neue'",
              color: "#606060",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            negativadoefeliz.com.br
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Bebas Neue",
          data: bebasNeue,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
