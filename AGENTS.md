# Architecture rules

- Preserve TanStack Start routing and separate self-hosted Vite/Nitro configuration from the managed preview configuration; the preview and standalone deployment use different runtimes.
- Validate all CMS writes and administrator roles in authenticated server functions; client-side gating is only navigation UX.
- Use cms_pages for published page blocks and route-specific metadata, keeping dedicated forms and collection interactions intact when replacing page copy.
- Keep deployment account provisioning in a private CLI, idempotent unless an explicit reset is requested; never expose account provisioning over HTTP.
- Gate the self-hosted site startup on a one-shot administrator initialization service that verifies public signup is disabled and reads the password from a mounted secret; failed initialization must prevent the first site launch.
- Use the self-hosted compatible auth/data/storage distribution for standalone deployment; do not alter generated Cloud clients or embed privileged configuration in browser bundles.
- Keep backup transfer scripts outside runtime routes and never emit account credentials or private content in logs.