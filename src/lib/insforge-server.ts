import { createClient } from "@insforge/sdk";

export function getInsforgeAdmin() {
  const baseUrl = process.env.INSFORGE_BASE_URL;
  const serviceKey = process.env.INSFORGE_SERVICE_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error("Missing InsForge server environment variables");
  }

  return createClient({
    baseUrl,
    edgeFunctionToken: serviceKey,
    isServerMode: true,
  });
}
