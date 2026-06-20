# Apple iPhone 風格 — Tailwind Few-Shot 範例庫

> 來源 token 全部取自實測報告：[`apple-iphone-grid-card-analysis.md`](./apple-iphone-grid-card-analysis.md)
> 用途：①當 LLM few-shot prompt（input 需求 → output Tailwind markup）②當人類複製貼上的元件範本。
> 全部數值對齊 Apple 實測：卡寬 400px、gap 20px、radius 18px、shadow `rgba(0,0,0,0.08) 2px 4px 12px`、CTA radius 980px、藍 `#0071E3`、近黑 `#1D1D1F`。

---

## 0. 設計 Token（tailwind.config.js）

把實測值固化成 design token，後續 few-shot 一律用語意 class，而非散落的 magic number。

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071E3',   // 主行動色（買）
          ink: '#1D1D1F',    // 近黑：標題/內文/次 CTA
          tag: '#F56300',    // 橘色「新機」eyebrow 標籤
          page: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '18px',        // 卡片圓角
        pill: '980px',       // 膠囊 CTA
      },
      boxShadow: {
        card: '2px 4px 12px 0 rgba(0,0,0,0.08)',        // 靜態
        'card-hover': '0 8px 24px 0 rgba(0,0,0,0.14)',  // hover
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0, 0, 0.5, 1)',
      },
      spacing: {
        scroller: '38px',    // scroller 底部呼吸空間
      },
      maxWidth: {
        nav: '1300px',       // 產品導覽容器上限
      },
    },
  },
  plugins: [],
};
```

```css
/* globals.css — 隱藏捲軸但保留可捲動（scroller 需要） */
@layer utilities {
  .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
  .scrollbar-none::-webkit-scrollbar { display: none; }
}
```

---

## Few-Shot 範例（input → output）

### 範例 1 — 橫向卡片滑動器（核心模式）

**Input：** 「做一個 Apple 風格的產品家族選擇器，固定卡寬、可橫向捲動，手機一次看一張、露出下一張邊緣。」

**Output：**
```html
<section class="mx-auto max-w-nav px-[22px]">
  <div class="flex gap-5 overflow-x-auto pb-scroller snap-x snap-mandatory scrollbar-none">
    <!-- card xN -->
    <article class="snap-center shrink-0 basis-[400px] max-[734px]:basis-[80vw]
                    bg-apple-page rounded-card shadow-card cursor-pointer
                    px-6 py-10 text-center
                    transition-all duration-300 ease-apple
                    hover:-translate-y-0.5 hover:shadow-card-hover">
      <!-- 內容見範例 2 -->
    </article>
  </div>
</section>
```
重點：`shrink-0 basis-[400px]`（不重排）＋ `snap-x snap-mandatory`＋手機 `basis-[80vw]`（暗示可滑）。

---

### 範例 2 — 產品卡片內容（雙 CTA + 新機標籤）

**Input：** 「卡片要有橘色『新機』標籤、產品圖、標題、起價、雙按鈕（深入了解＝次要、購買＝主要）。」

**Output：**
```html
<article class="shrink-0 basis-[400px] bg-apple-page rounded-card shadow-card
                px-6 py-10 text-center transition-all duration-300 ease-apple
                hover:-translate-y-0.5 hover:shadow-card-hover">
  <span class="text-sm font-semibold text-apple-tag">新機</span>

  <img src="/iphone-17-pro.png" alt="iPhone 17 Pro"
       class="mx-auto my-4 w-[292px] aspect-[1.29] object-contain" />

  <h3 class="text-[28px] font-semibold leading-tight text-apple-ink">
    iPhone 17 Pro 與 Pro Max
  </h3>
  <p class="mt-2 text-sm text-apple-ink">NT$39,900 起</p>

  <div class="mt-6 flex justify-center gap-3">
    <a href="#" class="rounded-pill bg-apple-ink  px-4 py-2 text-sm text-white
                       transition-colors hover:bg-black">深入了解</a>
    <a href="#" class="rounded-pill bg-apple-blue px-4 py-2 text-sm text-white
                       transition-colors hover:brightness-110">購買</a>
  </div>
</article>
```
重點：唯一高飽和色給「購買」；標題 `text-[28px]/font-semibold`；CTA `rounded-pill`。

---

### 範例 3 — 膠囊 CTA 按鈕（可重用元件）

**Input：** 「給我 Apple 主／次兩種膠囊按鈕。」

**Output：**
```html
<!-- Primary（行動/轉換） -->
<button class="rounded-pill bg-apple-blue px-5 py-2 text-sm font-normal text-white
               transition hover:brightness-110 active:brightness-95
               focus-visible:outline focus-visible:outline-2 focus-visible:outline-apple-blue">
  購買
</button>

<!-- Secondary（研究/次要） -->
<button class="rounded-pill bg-apple-ink px-5 py-2 text-sm text-white
               transition hover:bg-black active:opacity-90">
  深入了解
</button>
```
重點：`rounded-pill`(980px) 保證任意高度全圓；務必補 `focus-visible` 無障礙焦點環。

---

### 範例 4 — 桌機網格 / 手機 scroller 混合（品項多時）

**Input：** 「品項較多時，桌機要看到全部不用滑，手機才退回橫向滑動。」

**Output：**
```html
<!-- 桌機 auto-fit 多欄 grid；手機切換成橫滑 flex -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5
            max-[734px]:flex max-[734px]:overflow-x-auto max-[734px]:pb-scroller
            max-[734px]:snap-x max-[734px]:scrollbar-none">
  <article class="bg-apple-page rounded-card shadow-card p-6
                  max-[734px]:shrink-0 max-[734px]:basis-[80vw] max-[734px]:snap-center
                  transition-all duration-300 ease-apple hover:shadow-card-hover">
    …
  </article>
</div>
```
重點：`auto-fit, minmax(320px, 1fr)` 自動決定欄數；窄屏用 `max-[734px]:` 整組降級成 scroller。

---

### 範例 5 — paddlenav 左右翻頁箭頭（桌機）

**Input：** 「scroller 桌機要有左右圓形箭頭按鈕。」

**Output：**
```html
<div class="relative">
  <button aria-label="上一個"
          class="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:grid place-items-center
                 h-9 w-9 rounded-full bg-white/90 shadow-card backdrop-blur
                 transition hover:bg-white">‹</button>

  <div id="scroller" class="flex gap-5 overflow-x-auto pb-scroller snap-x scrollbar-none">…</div>

  <button aria-label="下一個"
          class="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:grid place-items-center
                 h-9 w-9 rounded-full bg-white/90 shadow-card backdrop-blur
                 transition hover:bg-white">›</button>
</div>

<script>
  // 一次翻一張卡（400 + 20 gap）
  const s = document.getElementById('scroller');
  document.querySelector('[aria-label="下一個"]').onclick = () => s.scrollBy({left: 420, behavior: 'smooth'});
  document.querySelector('[aria-label="上一個"]').onclick = () => s.scrollBy({left: -420, behavior: 'smooth'});
</script>
```
重點：箭頭 `md:` 才顯示（手機靠手勢）；翻頁位移＝卡寬 400 + gap 20 = **420px**。

---

### 範例 6 — React 元件化（TypeScript）

**Input：** 「把卡片包成可重用 React 元件。」

**Output：**
```tsx
type ProductCardProps = {
  name: string;
  price: string;
  image: string;
  badge?: string;            // 「新機」
  learnHref: string;
  buyHref: string;
};

export function ProductCard({ name, price, image, badge, learnHref, buyHref }: ProductCardProps) {
  return (
    <article
      className="shrink-0 basis-[400px] max-[734px]:basis-[80vw] snap-center
                 rounded-card bg-apple-page px-6 py-10 text-center shadow-card
                 transition-all duration-300 ease-apple
                 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      {badge && <span className="text-sm font-semibold text-apple-tag">{badge}</span>}
      <img src={image} alt={name} className="mx-auto my-4 w-[292px] aspect-[1.29] object-contain" />
      <h3 className="text-[28px] font-semibold leading-tight text-apple-ink">{name}</h3>
      <p className="mt-2 text-sm text-apple-ink">{price}</p>
      <div className="mt-6 flex justify-center gap-3">
        <a href={learnHref} className="rounded-pill bg-apple-ink  px-4 py-2 text-sm text-white hover:bg-black">深入了解</a>
        <a href={buyHref}   className="rounded-pill bg-apple-blue px-4 py-2 text-sm text-white hover:brightness-110">購買</a>
      </div>
    </article>
  );
}
```

---

## 速查表：實測值 → Tailwind class

| 設計屬性 | 實測值 | Tailwind |
|---|---|---|
| 卡片寬 | 400px（固定） | `shrink-0 basis-[400px]` |
| 卡片間距 | 20px | `gap-5` |
| 卡片圓角 | 18px | `rounded-card`（token） |
| 卡片陰影 | `rgba(0,0,0,.08) 2px 4px 12px` | `shadow-card`（token） |
| 過渡曲線 | `0.3s cubic-bezier(0,0,.5,1)` | `duration-300 ease-apple` |
| 主標題 | 28px / 600 | `text-[28px] font-semibold` |
| 主 CTA 色 | `#0071E3` | `bg-apple-blue` |
| 文字/次 CTA | `#1D1D1F` | `text-apple-ink` / `bg-apple-ink` |
| 膠囊按鈕 | radius 980px | `rounded-pill` |
| CTA padding | `8px 15px` | `px-4 py-2` |
| 圖片比例 | 292×227 ≈ 1.29 | `w-[292px] aspect-[1.29]` |
| scroller 底距 | 38px | `pb-scroller` |
| 手機斷點 | ≤ 734px | `max-[734px]:` |
| 容器上限 | 1300px | `max-w-nav` |

---

## 使用守則（避免 AI slop）

1. **永遠用語意 token**（`bg-apple-blue`）而非 `bg-[#0071e3]` 散落各處——改一次品牌色全站生效。
2. **色彩稀缺**：一張卡只有「購買」用 `apple-blue`，其餘 `apple-ink`/白，別到處上色。
3. **陰影分層、不要 border**：用 `shadow-card`，別用 `border`。
4. **CTA 一律 `rounded-pill`**，不要混用 `rounded-lg`。
5. **無障礙**：互動元素補 `focus-visible:outline`、圖片補 `alt`、箭頭補 `aria-label`。
