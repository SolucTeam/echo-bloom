FROM oven/bun:1.3.3 AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS admin-provision
COPY scripts/provision-admin.ts scripts/provision-admin-core.ts ./scripts/
COPY src/lib/cms-schema.ts ./src/lib/
USER root
CMD ["bun", "scripts/provision-admin.ts"]

FROM dependencies AS build
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SITE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY VITE_SITE_URL=$VITE_SITE_URL
RUN bunx vite build --config vite.selfhost.config.ts

FROM dependencies AS mail-worker
COPY scripts/mail-worker.ts scripts/mail-message.ts ./scripts/
COPY src/lib/mail-settings.ts ./src/lib/
USER bun
CMD ["bun", "scripts/mail-worker.ts"]

FROM node:22-alpine AS site
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]