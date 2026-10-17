export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: 418,
      error: "I'm a Teapot",
      message: "Aku adalah Teh. 🍵 Kau adalah Peminum Teh.",
      site: "HyperGaruda",
    },
    {
      status: 418,
      headers: {
        "Cache-Control": "no-store",
        "X-Error-Code": "418",
      },
    }
  );
}