# fitnfun-demo

Vite + React 18 + TypeScript + Tailwind CSS v3 demo frontend（`躍齡社區師資`）。

## Setup

```bash
npm install
cp .env.example .env   # set VITE_STRAPI_URL
npm run dev
```

Visit http://localhost:5174

> **Port 說明**：使用 `5174` 而非 Vite 預設的 `5173`，因為 Strapi 5 `develop` 模式的 Admin Panel Vite 內部佔用 `5173`。

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port **5174**, `host: true`) |
| `npm run build` | Type-check + production build |
| `npm test` | Run vitest unit tests |
| `npm run test:watch` | Vitest watch mode |

## 外部 / LAN 訪問

`vite.config.ts` 設定 `host: true`，會綁定 `0.0.0.0`，可從區網或 VPN 連入本機 IP：

```
➜  Network: http://<your-ip>:5174/
```

例如：`http://<your-ip>:5174/`

## UI / Layout（Apple-style Grid + Card）

師資卡片採用 Apple 商品卡風格，由共用元件 `src/components/InstructorCard.tsx` 提供，
`Home`（精選師資）與 `Instructors`（完整名單）共用同一視覺。

**設計 tokens**（`tailwind.config.js` extend，避免 raw hex）：

| Token | 值 | 用途 |
|---|---|---|
| `colors.apple.blue` | `#0071E3` | 主 CTA（每張卡唯一高彩度色） |
| `colors.apple.ink` | `#1D1D1F` | 標題 / 次 CTA |
| `colors.apple.tag` | `#F56300` | eyebrow 標籤 |
| `rounded-card` / `rounded-pill` | `18px` / `980px` | 卡片圓角 / 膠囊按鈕 |
| `shadow-card` / `shadow-card-hover` | — | 卡片陰影 / hover 浮起 |
| `ease-apple` | `cubic-bezier(0,0,0.5,1)` | 轉場曲線 |

**混合降級佈局（Hybrid responsive）**：

- 桌機：`grid-cols-[repeat(auto-fit,minmax(320px,1fr))]` 多欄自動排列
- 手機（`max-[734px]:`）：降級為 `flex overflow-x-auto snap-x` 橫向 snap scroller，
  卡片 `basis-[80vw]`，搭配 `.scrollbar-none`（定義於 `src/index.css`）
- CTA 皆補 `focus-visible:outline` 鍵盤焦點環

> 設計依據：`openspec/changes/demo-apple-grid-card/`（proposal / design / spec / tasks）。

## Stack

- **Vite 5** — Build tool
- **React 18** + TypeScript
- **Tailwind CSS v3** — Styling
- **Vitest 2** — Unit testing

## Environment Variables

| Var | Default | Description |
|---|---|---|
| `VITE_STRAPI_URL` | `http://localhost:1337` | Strapi API base URL |
