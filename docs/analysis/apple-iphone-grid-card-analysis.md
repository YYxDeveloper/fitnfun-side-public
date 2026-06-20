# Apple 台灣 iPhone 購買頁：Grid 與 Card 設計分析

> 目標頁面：`https://www.apple.com/tw/shop/buy-iphone`
> 方法說明：本報告以 **Chrome DevTools 實際載入頁面並執行 JavaScript 量測 `getComputedStyle` 與 `getBoundingClientRect`** 取得真實數值。標註方式：**【實測】** = 從 live DOM 直接量到；**【推斷】** = 基於 Apple 設計語言通用知識與量測結果的合理延伸。

---

## 0. 核心發現摘要（先講結論）

這頁的版面**並非傳統「多欄重排卡片網格（responsive multi-column grid）」**，而是 Apple 內部稱為 **`rf-cards-scroller`（橫向卡片滑動器）** 的模式。**【實測】** 主要產品機型（iPhone 17 Pro、iPhone Air、iPhone 17、iPhone 17e）由一個 `inline-flex` 的橫向滾動容器 `rf-cards-scroller-platter` 承載，卡片寬度固定，靠水平捲動與左右箭頭（paddlenav）瀏覽，而非斷點重排欄數。

| 關鍵量測 | 數值（實測） |
|---|---|
| 產品卡片寬度（card width） | **400px**（桌機/平板/手機皆固定不變） |
| 卡片間距（gap） | **20px** |
| 卡片圓角（border-radius） | **18px** |
| 卡片陰影（box-shadow） | `rgba(0,0,0,0.08) 2px 4px 12px 0px` |
| 卡片過渡（transition） | `0.3s cubic-bezier(0, 0, 0.5, 1)` |
| 主標題（headline） | 28px / weight 600 / `rgb(29,29,31)` |
| 滾動容器總寬（scrollWidth） | 2544px（橫向溢出捲動） |

---

## 1. Grid 網格系統

### 1.1 整體版面網格

Apple 仍使用其經典的 **12 欄網格系統（12-column grid）**，類別命名以 `large-N / small-N` 表示欄跨度。**【實測】** 範例：

| 元素類別 | 欄跨度語意 | 量測寬度 |
|---|---|---|
| `column large-8 small-12 rs-shop-header-section` | 桌機 8 欄 / 手機 12 欄（滿版） | 640px |
| `column large-4 small-12 rs-shop-chatstore-section` | 桌機 4 欄 / 手機 12 欄 | 122px |
| `as-globalfooter-directory with-5-columns` | 頁尾 5 欄 | 980px |

- **容器 max-width（最大寬度）【實測】**：
  - 全站導覽列 `globalnav-content`：`max-width: 1024px`，左右 `padding: 22px`
  - 產品導覽 `rf-navbar-content`：`max-width: 1300px`
  - 頁尾 `as-globalfooter-content`：`max-width: 980px`，左右 `padding: 22px`
- **Gutter（欄間距）【實測】**：產品卡片之間固定 **20px**；全站導覽左右安全邊距 **22px**。
- **重要觀察【實測】**：頁面在 1440px 寬下**幾乎找不到真正的 CSS Grid（`display:grid` 多欄）容器**（`realGrids` 回傳空陣列）。Apple 此頁的版面骨架是 **flexbox + 橫向 scroller**，網格系統 class 主要用在頁首/頁尾的靜態區塊。

### 1.2 響應式斷點（breakpoints）

**【實測】** 在三個寬度量測卡片行為：

| 視窗寬度 | 卡片寬度 | 卡片間距 | scroller 行為 | 欄數變化 |
|---|---|---|---|---|
| 桌機 1440px | 400px | 20px | 橫向捲動（scrollWidth 2544） | 一次可見約 3.5 張 |
| 平板 768px | **400px（不變）** | 20px | 橫向捲動 | 一次可見約 1.9 張 |
| 手機 ~500px | **400px（不變）** | 20px | 橫向捲動 | 一次可見約 1 張（露出下一張邊緣） |

**根本設計決策（Root Cause）**：Apple **刻意不讓產品卡片重排欄數**，而是固定卡片寬度、改變「一次能看到幾張」。這是 Apple 全站慣用的 `large-N / small-N` 斷點系統（**【推斷】** 對應約 `large ≥ 1069px`、`medium ≈ 735–1068px`、`small ≤ 734px` 的 Apple 內部斷點），但在此 scroller 上表現為「可視卡片數」而非「grid 欄數」。

- **左右箭頭導覽（paddlenav）【實測】**：頁面存在 `.paddlenav`（`rf-navbar-paddlenav-pr` / `-ne`），桌機提供箭頭點擊翻頁。
- **捲動對齊（scroll-snap）【實測】**：`scroll-snap-type: none`、`scroll-snap-align: none`——Apple 此處**未使用 CSS scroll-snap**，而是用 JavaScript 控制慣性與翻頁定位（**【推斷】** 為了更精細的緩動與 paddlenav 同步）。

### 1.3 對齊原則與留白節奏（spacing rhythm）

**【實測 + 推斷】** 量到的間距值（20px gap、22px 容器 padding、卡片內 38px 底距）呈現 **以 ~4px 為基數的節奏**：

```
8px → 15px(≈16) → 20px → 22px → 38px(≈40)
```

- CTA 按鈕 padding **【實測】**：`8px 15px`（垂直 8、水平 15）。
- scroller crop 底部留白 **【實測】**：`padding: 0 0 38px`——卡片下方保留呼吸空間給陰影與翻頁。
- 對齊原則：卡片內容為 **置中對齊（`rf-hcard-centered`）**，標題、價格、雙 CTA 沿垂直中軸堆疊。

---

## 2. Card 卡片設計

### 2.1 卡片結構組成（由實測 DOM 還原）

單一產品卡片類別：`rf-hcard-content tile as-util-relatedlink`，內含 `rf-hcard rf-hcard-40 rf-card-msgtag-orange rf-hcard-centered`。**【實測】** 由上而下：

```
┌─────────────────────────────┐  ← 卡片 400×~500，radius 18px，白底，陰影
│   [新機標籤 msgtag-orange]    │  ← 橘色訊息標籤（rf-card-msgtag-orange）
│                             │
│      [產品圖 292×227]        │  ← object-fit, ratio ≈ 1.29
│                             │
│   iPhone 17 Pro 與 Pro Max   │  ← headline 28px / 600
│                             │
│   NT$39,900 起               │  ← 價格 14px / 400
│   含稅約 NT$1,900 ①          │  ← 註腳 14.4px / 600
│                             │
│  (深入了解)     (購買)        │  ← 雙 CTA pill 按鈕
└─────────────────────────────┘
```

- **訊息標籤（message tag）【實測】**：類別 `rf-card-msgtag-orange`——Apple 用「橘色 eyebrow 標籤」標示新機（如「新機」），是 family chooser 的視覺焦點導引。
- **雙 CTA 模式【實測】**：每張卡片提供「深入了解（次要）」+「購買（主要）」兩顆按鈕，分流「研究型」與「決策型」使用者。

### 2.2 視覺層級、字級層級與顏色

**【實測】** 卡片內字體層級（由大到小）：

| 角色 | 字級 | 字重 | 顏色 |
|---|---|---|---|
| 主標題 headline | **28px** | 600 | `rgb(29, 29, 31)` 近黑 |
| CTA「深入了解」 | 17px | — | white on `rgb(29,29,31)` |
| CTA「購買」 | 14px | — | white on `rgb(0,113,227)` |
| 價格 | 14px | 400 | `rgb(29, 29, 31)` |
| 註腳/稅額 | 14.4px | 600 | `rgb(29, 29, 31)` |

**顏色系統【實測】**：
| 語意 | 色值 | 用途 |
|---|---|---|
| Apple 藍（主行動色） | `rgb(0, 113, 227)` `#0071E3` | 「購買」主 CTA |
| 近黑（文字/次 CTA） | `rgb(29, 29, 31)` `#1D1D1F` | 標題、內文、次要按鈕 |
| 白 | `#FFFFFF` | 卡片底色、按鈕文字 |
| 橘 | （msgtag-orange） | 新機標籤 |

> 視覺層級邏輯：**主標題（28px）→ 圖片 → 價格 → CTA**，藍色「購買」是整張卡片唯一的高飽和彩色，視線自然落點，符合「色彩稀缺性引導行動」原則。

### 2.3 卡片內距、圓角、陰影、互動狀態

**【實測】**：

| 屬性 | 數值 |
|---|---|
| 圓角 border-radius | **18px**（柔和大圓角，Apple 現行語言） |
| 陰影 box-shadow | `rgba(0,0,0,0.08) 2px 4px 12px 0px`（極淡、低對比、向下偏移） |
| 背景 | `#FFFFFF` |
| 邊框 | 無（靠陰影分層，非描邊） |
| cursor | `pointer`（整張卡可點） |
| transition | `0.3s cubic-bezier(0, 0, 0.5, 1)` |

- **CTA 按鈕【實測】**：`border-radius: 980px`（標誌性「膠囊/pill」形——用超大值確保永遠全圓角）、`padding: 8px 15px`。
- **hover 狀態【推斷】**：transition 已綁在卡片上（0.3s ease-out 類曲線），**【推斷】** hover 時會有極輕微的陰影加深 / 位移，但本次靜態量測 `transform: none`（未觸發 hover）。

### 2.4 圖片比例與處理

**【實測】**：產品圖渲染尺寸 **292×227px，比例約 1.29:1（近 5:4 橫向）**，`object-fit` 為渲染填充。**【推斷】** Apple 使用去背 PNG / `<picture>` 搭配 `srcset` 提供 1x/2x/3x 多解析度，圖片在卡片上方置中、無自身圓角（圓角由卡片容器負責）。

---

## 3. 設計模式與為何有效

### 3.1 採用的設計模式

1. **橫向卡片滑動器（Horizontal Card Scroller / Carousel）** — 固定卡寬 + 水平捲動 + paddlenav 箭頭。
2. **Family Chooser（產品家族選擇器）** — 每張卡 = 一個機型家族，先選家族再進細部配置。
3. **雙 CTA 分流** — 「深入了解（研究）」vs「購買（轉換）」。
4. **Eyebrow 訊息標籤** — 橘色標籤標示「新機」製造新鮮感與時效性。
5. **陰影分層而非描邊** — 用極淡陰影建立卡片浮起感，維持乾淨留白。
6. **膠囊 CTA（pill button）** — `radius: 980px` 全站一致的按鈕語言。

### 3.2 為何有效

| 角度 | 效益 |
|---|---|
| **轉換率（Conversion）** | 唯一高飽和藍色集中在「購買」CTA，視覺動線無干擾直達行動；雙 CTA 同時承接「還在研究」與「已決定」兩種意圖，不流失任一族群。 |
| **可用性（Usability）** | 固定卡寬讓每張卡資訊密度恆定，使用者跨機型比較時認知負荷低；橫向 scroller 在手機上一次聚焦一張，避免小螢幕資訊爆量。 |
| **品牌一致性（Brand Consistency）** | 18px 圓角、980px 膠囊按鈕、`#0071E3` 藍、`#1D1D1F` 近黑、`#FFFFFF` 大量留白——全為 Apple 跨頁面共用 token，使用者一眼辨識「這是 Apple」。 |
| **效能（Performance）** | flexbox + 水平捲動避免複雜 grid reflow；陰影用低 alpha 單層，渲染成本低。 |

---

## 4. 可借鏡的實作建議

### 4.1 復刻「橫向卡片滑動器」（貼近 Apple 實作）

```css
.scroller {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* Apple 用 JS，但一般專案用原生 snap 更省事 */
  padding-block-end: 38px;       /* 留陰影呼吸空間 */
  scrollbar-width: none;
}
.card {
  flex: 0 0 400px;               /* 固定卡寬，不重排 */
  scroll-snap-align: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: rgba(0,0,0,0.08) 2px 4px 12px 0;
  padding: 40px 24px;
  text-align: center;
  transition: 0.3s cubic-bezier(0, 0, 0.5, 1);
  cursor: pointer;
}
.card:hover { box-shadow: rgba(0,0,0,0.14) 0 8px 24px 0; transform: translateY(-2px); }
.card__title { font-size: 28px; font-weight: 600; color: #1d1d1f; line-height: 1.25; }
.cta--primary { background: #0071e3; color: #fff; border-radius: 980px; padding: 8px 16px; }
.cta--secondary { background: #1d1d1f; color: #fff; border-radius: 980px; padding: 8px 16px; }

/* 手機：卡片略縮但不重排，露出下一張邊緣暗示可滑 */
@media (max-width: 734px) {
  .card { flex-basis: 80vw; }
}
```

### 4.2 Tailwind 版本

```html
<div class="flex gap-5 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-none">
  <article class="snap-center shrink-0 basis-[400px] max-[734px]:basis-[80vw]
                  bg-white rounded-[18px] shadow-[2px_4px_12px_0_rgba(0,0,0,0.08)]
                  px-6 py-10 text-center cursor-pointer
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 hover:shadow-[0_8px_24px_0_rgba(0,0,0,0.14)]">
    <span class="text-orange-500 text-sm font-semibold">新機</span>
    <img class="mx-auto my-4 w-[292px] aspect-[1.29]" src="..." alt="">
    <h3 class="text-[28px] font-semibold text-[#1d1d1f] leading-tight">iPhone 17 Pro</h3>
    <p class="text-sm text-[#1d1d1f] mt-2">NT$39,900 起</p>
    <div class="mt-6 flex justify-center gap-3">
      <a class="rounded-full bg-[#1d1d1f] text-white px-4 py-2 text-sm">深入了解</a>
      <a class="rounded-full bg-[#0071e3] text-white px-4 py-2 text-sm">購買</a>
    </div>
  </article>
</div>
```

> 若你的場景比較需要「桌機看全部、手機才滑」，可在桌機改用真正的多欄 grid：
> `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;`，手機再退回 scroller。Apple 因 SKU 少（4 個家族）才選擇全程 scroller。

### 4.3 五個關鍵 Takeaways

1. **固定卡寬 + 橫向捲動 > 重排欄數**（當品項少時）。卡寬恆定（400px）讓跨機型比較的認知負荷最低，手機只露一張、邊緣暗示可滑。
2. **色彩稀缺即引導**。整張卡只有「購買」用高飽和 `#0071E3`，視線自動落點到轉換按鈕；其餘一律近黑 `#1D1D1F` + 白。
3. **陰影分層，拒絕描邊**。`rgba(0,0,0,0.08)` 極淡單層陰影 + 18px 圓角 + 白底，乾淨且有層次，比 border 更高級。
4. **膠囊按鈕用 `border-radius: 980px`**。超大圓角值保證任何高度都全圓，是 Apple 全站一致的按鈕語言。
5. **雙 CTA 分流意圖**。「深入了解（研究型）」+「購買（決策型）」並存，不強迫使用者二選一，最大化承接漏斗各階段流量。

---

## 量測誠實聲明

- **【實測】**：卡片寬 400px、gap 20px、radius 18px、shadow `rgba(0,0,0,0.08) 2px 4px 12px 0`、transition `0.3s cubic-bezier(0,0,0.5,1)`、CTA `radius 980px / padding 8px 15px`、藍 `#0071E3`、近黑 `#1D1D1F`、標題 28px/600、圖片 292×227、三斷點卡寬皆不變、paddlenav 存在、`scroll-snap: none`、12 欄 `large-N/small-N` class。
- **【推斷】**：Apple 內部精確斷點門檻（735/1069px）、hover 互動的確切位移量、圖片 srcset 多解析度策略、scroller 以 JS 而非原生 snap 控制的動機。

---

_來源：以 Chrome DevTools 實測 `https://www.apple.com/tw/shop/buy-iphone`（2026-06-19）。_
