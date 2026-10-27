import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from '@/integrations/supabase/auth-attacher';

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Protection CSRF des fonctions serveur : les fonctions serveur sont des points
 * d'appel RPC same-origin, on refuse donc les requêtes cross-site qui les visent.
 * Le filtre limite la validation aux server functions — les requêtes de routage
 * (pages) ne sont pas concernées.
 */
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
