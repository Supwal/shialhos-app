# Deploy ShiAlhos no Cloudflare Pages

## Configuração no Painel Cloudflare

Acesse: https://dash.cloudflare.com → Pages → Create a project → Connect to Git

### Passo 1 — Conectar repositório
- Selecione: **Supwal/shialhos-app**

### Passo 2 — Configurações de build

| Campo | Valor |
|-------|-------|
| Project name | `shialhos-app` |
| Production branch | `main` |
| Build command | `npm install && npx expo export --platform web` |
| Build output directory | `dist` |
| Root directory | `/` (raiz) |

### Passo 3 — Variáveis de ambiente (Environment variables)

Adicione antes de fazer o primeiro build:

| Variável | Valor |
|----------|-------|
| `NODE_VERSION` | `20` |
| `EXPO_PUBLIC_MP_TOKEN` | (seu Access Token MercadoPago) |

### Passo 4 — Salvar e Deploy
Clique em **Save and Deploy**.

O Cloudflare vai buildar e publicar automaticamente a cada novo push no branch `main`.

---

## URL após deploy
Será algo como: `https://shialhos-app.pages.dev`

## Push para novo deploy
```bash
cd ShiAlhos_app
git add .
git commit -m "feat: descrição da alteração"
git push origin main
```
O Cloudflare detecta o push e inicia novo build automaticamente.
