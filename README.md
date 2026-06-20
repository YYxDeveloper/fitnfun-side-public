# fitnfun-side

> **📢 Public Mirror Notice**
> 這是 `fitnfun-side` 的公開鏡像版本（**public mirror**），已將以下敏感資產移除：
> - 內部教學文件 (`教學/`)
> - 內部 OpenSpec 變更規格 (`openspec/`)
> - 真實師資照片與個資 (`demo/asset/`, `demo/public/images/instructors/`)
> - 內部會議 PDF
>
> 原始 private repo：[`YYxDeveloper/fitnfun-side`](https://github.com/YYxDeveloper/fitnfun-side)
>
> **Live Demo**: https://yyxdeveloper.github.io/fitnfun-side-public/

基於 **Strapi 5** 的 Headless CMS 後端，搭配 **Vite + React** 前端 Demo（`躍齡社區師資`）。

## Services

| 服務 | Port | 啟動指令 | 說明 |
|---|---|---|---|
| **Strapi Backend** | `1337` | `./start.sh` | Headless CMS + REST API |
| **Strapi Admin** | `1337/admin` | （隨 backend 啟動）| 後台管理介面 |
| **Strapi Admin Vite**（內建）| `5173` | — | ⚠️ **勿佔用** — Strapi develop 模式內部使用 |
| **Demo Frontend** | `5174` | `cd demo && npm run dev` | Vite + React 18 + TS + Tailwind |

> **Port 衝突說明**：Strapi 5 在 `develop` 模式下，內建 Admin Panel Vite 預設佔用 `5173`。因此 Demo 改用 `5174` 以避免衝突。

## 快速開始

```bash
# 1. 啟動 Strapi 後端
./start.sh

# 2. 開啟管理後台
open http://localhost:1337/admin

# 3. 首次使用 — 註冊管理員帳號
#    填寫姓名、Email、密碼 → Create Admin

# 4. 啟動 Demo 前端（新終端）
cd demo && npm install && npm run dev
# → http://localhost:5174
```

## 開發指令

```bash
# 啟動（開發模式，檔案變更自動重啟）
npm run develop

# 啟動（正式模式）
npm run start

# 建置 Admin Panel
npm run build

# 升級 Strapi（乾執行，僅檢查）
npm run upgrade:dry

# 升級 Strapi
npm run upgrade

# 進入互動式 Console
npm run console
```

> 以上指令需在 `strapi/` 目錄下執行；或直接從根目錄執行 `./start.sh`。

## 目錄結構

```
fitnfun-side/
├── start.sh          # 啟動腳本（cd strapi && npm run develop）
├── demo/             # Vite + React 前端 Demo
│   ├── src/
│   │   ├── pages/    # Home, Instructors
│   │   ├── components/
│   │   ├── data/     # 靜態 / 範例資料
│   │   └── utils/    # API 呼叫工具
│   ├── vite.config.ts  # port 5174, host: 0.0.0.0
│   └── package.json
├── strapi/           # Strapi 應用程式
│   ├── config/       # 設定檔（資料庫、伺服器、中介軟體）
│   ├── src/
│   │   ├── api/      # 自訂 Content Types
│   │   ├── extensions/ # Plugin 擴充
│   │   └── index.ts  # 生命週期鉤子（register / bootstrap）
│   ├── database/     # 資料庫遷移
│   ├── public/       # 靜態檔案（上傳、robots.txt）
│   ├── types/        # 自動生成的 TypeScript 型別
│   └── .env          # 環境變數（已 gitignore）
└── .gitignore
```

## Demo Frontend

詳見 [`demo/README.md`](./demo/README.md)。

```bash
cd demo
npm install
npm run dev      # http://localhost:5174
```

**外部訪問**：`demo/vite.config.ts` 已設定 `host: true`，可從 LAN/VPN 用本機 IP 連線，例如 `http://<your-ip>:5174/`。

## 資料庫

預設使用 **PostgreSQL**，連線設定在 `strapi/.env`：

| 變數 | 值 |
|---|---|
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST` | `127.0.0.1` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `fitnfun` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | `postgres` |

若想改用 **SQLite**（零安裝），將 `.env` 中的 `DATABASE_CLIENT` 改為 `sqlite` 並清空其他 `DATABASE_*` 變數即可。

## 建立 Content Type

1. 開啟 `http://localhost:1337/admin` → **Content-Type Builder**
2. 點選 **Create new collection type**（或 **Single type**）
3. 設定欄位（文字、圖片、關聯等）
4. 點選 **Save** → Strapi 自動重啟
5. 前往 **Content Manager** 新增內容
6. API 自動產生在 `GET /api/{content-type}`

## API 使用

所有 Content Type 自動產生 RESTful API：

```bash
# 列表（含計數）
GET    /api/articles
GET    /api/articles?populate=*

# 單筆
GET    /api/articles/:id

# 新增
POST   /api/articles
Content-Type: application/json
{
  "data": { "title": "Hello" }
}

# 更新
PUT    /api/articles/:id

# 刪除
DELETE /api/articles/:id
```

> 未認證的公開 API 需在 **Settings → Users & Permissions → Roles → Public** 中開啟對應權限。

## 部署

- **Strapi Cloud**：內建支援，`npm run deploy`
- **自架**：設定生產環境的 `DATABASE_URL`、`APP_KEYS` 等環境變數後執行 `npm run build && npm run start`
