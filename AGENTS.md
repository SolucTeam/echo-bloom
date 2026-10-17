# Architecture rules

- Preserve TanStack Start routing and separate self-hosted Vite/Nitro configuration from the managed preview configuration; the preview and standalone deployment use different runtimes.
- Article detail routes use the un-nested blog_ filename so the listing does not swallow the reading page; preserve public /blog/<slug> URLs.
- Validate all CMS writes and administrator roles in authenticated server functions; client-side gating is only navigation UX.
- Use cms_pages for published page blocks and route-specific metadata, keeping dedicated forms and collection interactions intact when replacing page copy.
- Keep site-wide lists such as partner logos in editable settings with the shipped originals as fallback, so the console can change them without a code edit.
- Keep deployment account provisioning in a private CLI, idempotent unless an explicit reset is requested; never expose account provisioning over HTTP.
- Gate the self-hosted site startup on a one-shot administrator initialization service that verifies public signup is disabled and reads the password from a mounted secret; failed initialization must prevent the first site launch.
- Use the self-hosted compatible auth/data/storage distribution for standalone deployment; do not alter generated Cloud clients or embed privileged configuration in browser bundles.
- Keep backup transfer scripts outside runtime routes and never emit account credentials or private content in logs.
- Keep media storage and media-library metadata administrator-only; public pages use explicitly saved signed image URLs so unpublished library files cannot be enumerated or downloaded anonymously.
- Store newsletter display settings and the external subscription-page link as a validated site setting; campaign sending stays with a dedicated external email service, avoiding a nonfunctional local signup form.
- Store contact and volunteer form configuration in validated site settings shared by public pages and submission handlers; enforce closure and optional-field visibility server-side.

- Keep the project catalogue and structured detail content in validated site settings, with original project fallbacks; use /projets for discovery and dynamic /projets/$slug detail routes while preserving existing URLs. Structured project details take precedence over legacy CMS blocks; CMS pages retain route metadata and the collection introduction.
- Resolve every project detail URL through the single dynamic route; invalid, hidden and deleted projects return not found and stay out of the sitemap, preventing static-route collisions and stale CMS discovery links.
