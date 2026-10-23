export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Cette page n'a pas pu se charger — Green Ivory</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #f4f7ef; color: #1a3c2a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #fff; border: 1px solid #dce7d3; border-radius: 1.5rem; box-shadow: 0 10px 30px rgb(26 60 42 / .08); }
      .badge { position: relative; width: 8.5rem; height: 8.5rem; margin: 0 auto 1.25rem; }
      .ring { position: absolute; inset: 0; border: 2px dashed #a0c49d; border-radius: 50%; animation: gi-spin 9s linear infinite; }
      .core { position: absolute; inset: 1rem; border-radius: 50%; background: #e6eedb; display: grid; place-items: center; animation: gi-breathe 3.2s ease-in-out infinite; }
      svg { width: 4rem; height: auto; color: #2d5a3d; }
      h1 { font-size: 1.25rem; margin: 0 0 .5rem; }
      p { color: #5a6b5d; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: .5rem 1rem; border-radius: 9999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #1a3c2a; color: #fff; }
      .secondary { background: #fff; color: #1a3c2a; border-color: #c9d8bd; }
      @keyframes gi-spin { to { transform: rotate(360deg); } }
      @keyframes gi-breathe { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgb(160 196 157 / .55); } 50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgb(160 196 157 / 0); } }
      @media (prefers-reduced-motion: reduce) { .ring, .core { animation: none; } }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="badge" aria-hidden="true">
        <div class="ring"></div>
        <div class="core">
          <svg viewBox="0 0 240 140" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round">
            <path d="M58,70 C78,24 162,14 224,70 C162,126 78,116 58,70 Z" />
            <path d="M58,70 Q142,76 224,70" />
          </svg>
        </div>
      </div>
      <h1>Cette page n'a pas pu se charger</h1>
      <p>Une erreur est survenue de notre côté. Vous pouvez réessayer ou revenir à l'accueil.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Réessayer</button>
        <a class="secondary" href="/">Accueil</a>
      </div>
    </div>
  </body>
</html>`;
}
