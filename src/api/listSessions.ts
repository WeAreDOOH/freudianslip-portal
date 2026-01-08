import { fetchAuthSession } from "aws-amplify/auth";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { Sha256 } from "@aws-crypto/sha256-js";

const REGION = "eu-west-2";
const FUNCTION_URL = "https://nagrqllqvdpjsngonduko4lmuy0vqrnh.lambda-url.eu-west-2.on.aws/";

export async function listSessions(): Promise<{ sessions: { sessionId: string }[] }> {
  // Get temporary AWS credentials from Cognito Identity Pool (authenticated)
  const { credentials } = await fetchAuthSession();
  if (!credentials) throw new Error("No AWS credentials - is Identity Pool configured?");

  const url = new URL(FUNCTION_URL);

  const signer = new SignatureV4({
    credentials,
    region: REGION,
    service: "lambda",
    sha256: Sha256,
  });

  const unsigned = new HttpRequest({
    method: "GET",
    protocol: url.protocol,
    hostname: url.hostname,
    path: url.pathname, // no query right now
    headers: {
      host: url.hostname,
    },
  });

  const signed = await signer.sign(unsigned);

  const resp = await fetch(FUNCTION_URL, {
    method: "GET",
    headers: signed.headers as Record<string, string>,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  return resp.json();
}
