type PaymeEnvironment = Record<string, string | undefined>;

export interface PaymeSessionResult {
  status: number;
  body: Record<string, unknown>;
}

const readJson = async (response: Response): Promise<Record<string, unknown>> => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export async function createPaymeSession(
  environment: PaymeEnvironment,
): Promise<PaymeSessionResult> {
  const authBaseUrl = environment.PAYME_AUTH_BASE_URL?.replace(/\/$/, "");
  const apiAudience = environment.PAYME_API_AUDIENCE;
  const clientId = environment.PAYME_CLIENT_ID;
  const clientSecret = environment.PAYME_CLIENT_SECRET;
  const merchantCode = environment.PAYME_MERCHANT_CODE;

  const missing = [
    ["PAYME_AUTH_BASE_URL", authBaseUrl],
    ["PAYME_API_AUDIENCE", apiAudience],
    ["PAYME_CLIENT_ID", clientId],
    ["PAYME_CLIENT_SECRET", clientSecret],
    ["PAYME_MERCHANT_CODE", merchantCode],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    console.error(`Pay-me configuration is incomplete: ${missing.join(", ")}`);
    return {
      status: 500,
      body: { error: "La configuración de Pay-me está incompleta." },
    };
  }

  try {
    const tokenResponse = await fetch(`${authBaseUrl}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "authorize",
        grant_type: "client_credentials",
        audience: apiAudience,
        client_id: clientId,
        client_secret: clientSecret,
        scope: "create:token post:charges offline_access",
      }),
    });
    const tokenData = await readJson(tokenResponse);
    const accessToken = tokenData.access_token;

    if (!tokenResponse.ok || typeof accessToken !== "string" || !accessToken) {
      console.error(`Pay-me token request failed with status ${tokenResponse.status}`);
      return {
        status: 502,
        body: { error: "No se pudo iniciar la sesión segura de Pay-me." },
      };
    }

    const nonceResponse = await fetch(`${authBaseUrl}/nonce`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "create.nonce",
        audience: apiAudience,
        client_id: clientId,
        scope: "post:charges",
      }),
    });
    const nonceData = await readJson(nonceResponse);
    const nonce = nonceData.nonce;

    if (!nonceResponse.ok || typeof nonce !== "string" || !nonce) {
      console.error(`Pay-me nonce request failed with status ${nonceResponse.status}`);
      return {
        status: 502,
        body: { error: "No se pudo preparar el formulario seguro de Pay-me." },
      };
    }

    return {
      status: 200,
      body: { nonce, merchant_code: merchantCode },
    };
  } catch (error) {
    console.error(
      "Pay-me session request failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return {
      status: 502,
      body: { error: "No se pudo conectar con Pay-me." },
    };
  }
}
