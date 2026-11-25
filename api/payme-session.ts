import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPaymeSession } from "../server/payme";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const result = await createPaymeSession(process.env);
  return response.status(result.status).json(result.body);
}
