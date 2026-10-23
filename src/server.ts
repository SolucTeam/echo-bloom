import "./lib/error-capture";
import { ensureNodeWebSocket } from "./lib/server-ws.server";

ensureNodeWebSocket();

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// The client went away mid-request (dev HMR reload, aborted prefetch, closed
// tab): nothing we render will ever be read, so fail quietly instead of
// logging a misleading 500.
function isClientAbortError(error: unknown, depth = 0): boolean {
  if (!error || typeof error !== "object" || depth > 5) return false;
  const e = error as { message?: unknown; code?: unknown; cause?: unknown };
  if (e.code === "ECONNRESET" || e.code === "EPIPE") return true;
  if (e.message === "aborted") return true;
  return isClientAbortError(e.cause, depth + 1);
}

function clientAborted(request: Request, error?: unknown): boolean {
  return request.signal?.aborted === true || isClientAbortError(error);
}

function abortedRequestResponse(): Response {
  // 499 = client closed request (nginx convention); semantically more honest
  // than a 500 for a response no one is waiting on.
  return new Response(null, { status: 499 });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  request: Request,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  const captured = consumeLastCapturedError();
  if (clientAborted(request, captured)) {
    return abortedRequestResponse();
  }

  console.error(captured ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response, request);
    } catch (error) {
      if (clientAborted(request, error)) {
        return abortedRequestResponse();
      }
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
