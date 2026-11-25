import { createPaymeSession } from "../server/payme";

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ error: "Método no permitido." }, 405);
    }

    const result = await createPaymeSession(process.env);
    return json(result.body, result.status);
  },
};
