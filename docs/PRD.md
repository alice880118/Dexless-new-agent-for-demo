# Dexless Nav Demo — Product Requirements Document (PRD)

> 版本：2026-07-29  
> 範圍：Onboarding 註冊／登入、Trader DNA Agent 視窗、Draft Order／Signal demo  
> 性質：前端互動原型（mock），非真實鏈上／後端

---

## 1. 產品目標

提供可演示的完整使用者旅程：

1. 從首頁進入登入／註冊（Email 或 Wallet）
2. 新用戶完成 Referral → Create account → Add funds → Trader DNA Live
3. 舊用戶快速 Enable trading → Trader DNA Live
4. 開啟 Agent，以關鍵字觸發 Draft Order、TP/SL、Deposit、Signal 等 demo

---

## 2. 入口與畫面架構

| 入口 | 行為 |
|------|------|
| 首頁 **Connect wallet** | 開啟 `OnboardingDialog` |
| Onboarding 完成且點 **Explore Now** | 開啟 Agent（`openAgent: true`） |
| 已連線後點 Agent / Trader DNA | 直接開 Agent |

| 裝置 | Agent 元件 |
|------|------------|
| Mobile（&lt;768） | `AgentChatDialog`（底部 sheet） |
| Desktop | `DesktopTraderDnaPanel` |

頁面高度需扣除上方 header **48px**。

---

## 3. Demo 帳號與驗證碼

定義於 `app/packages/onboarding/assets.ts`。

| 類型 | Email | 驗證碼 | 流程結果 |
|------|-------|--------|----------|
| **新用戶** | `new` | `111111` | Referral → Setup → Funds → Trader DNA Live |
| **舊用戶** | `old` | `111111` | 跳過 Referral／Setup／Funds → Enable trading → Trader DNA Live |

### Email 額外測試字串

| 輸入 | 結果 |
|------|------|
| `fail@test.com` | 無法寄送驗證碼 |
| 驗證碼 `000000` | 驗證碼過期 |
| 其他合法 email + 錯誤碼 | Incorrect code |
| 僅 `new` / `old` + `111111` | 驗證成功 |

### WalletConnect QC（模擬連線）

| 選項 | 行為 |
|------|------|
| `>new user` | 當新用戶：Referral → Setup（略過真實簽名彈窗）→ Funds → Trader DNA |
| `old user` | 當舊用戶：Enable trading → Trader DNA（無 Add funds） |

---

## 4. Onboarding 完整流程

### 4.1 狀態總覽

```
sign-in
  ├─ Continue with Email → email → code
  │     ├─ new + 111111 → referral → setup → sign×2 → funds → trader-dna-live
  │     └─ old + 111111 → enable-trading → trader-dna-live
  └─ Connect Wallet → wallet-connect
        ├─ >new user → referral → setup → funds → trader-dna-live
        └─ old user  → enable-trading → trader-dna-live
```

### 4.2 步驟明細

#### A. Sign In（首頁）

- **畫面**：Hero 圖 +「Trade Smarter with Dexless AI」+「Understands your trading behavior」+ Sign In CTA
- **按鈕**
  - `Connect Wallet` → WalletConnect
  - `Continue with Email` → Email 輸入

#### B. Email

- 標題：Log in or sign up
- 輸入 email → 送出（約 800ms）→ 進驗證碼頁
- Recent 可一鍵帶入 `new`

#### C. Confirmation code

- 6 位碼；正確則依 new／old 分流
- `Resend code`：冷卻後可重送

#### D. Referral code（僅新用戶）

- 顯示 Dexless Wallet 區塊
- `Apply`（有填 code）／`Skip for Now` → 皆進入 Setup

#### E. Set up account

| Phase | 標題 | CTA | 下一步 |
|-------|------|-----|--------|
| 1 | Create your Dexless account | Continue — Step 1 of 2 | Email 路徑開 Sign message；Wallet QC 自動進 phase 2 |
| 2 | Enable trading | Continue — Step 2 of 2 | Email 再開第二次 Sign；完成後進 Funds |

- 可勾選 **Remember me**
- **Disconnect wallet** 可中斷

#### F. Sign message（Email 新用戶）

- 兩輪：`Sign and continue`
- Round 1 後回 Setup phase 2；Round 2 後進 Add funds

#### G. Add funds（新用戶）

- 選擇網路、顯示 deposit address、複製
- **Done** → Trader DNA Live

#### H. Enable trading（舊用戶／Wallet return）

- 獨立 modal；CTA loading 約 2s → Trader DNA Live

#### I. Trader DNA Live

- **Explore Now** → 關閉 onboarding 並開啟 Agent
- 關閉／略過則不一定開 Agent

---

## 5. Agent 視窗流程

### 5.1 Home

| 元素 | 行為 |
|------|------|
| Chips：Trending / Crypto / Analysis | 展開建議句，點選進入聊天 |
| 建議句範例 | `Should I buy BTC right now?` 等 → 一般分析結果 |
| **View Signal** | 進入 Signal 列表 |
| 輸入框 placeholder | `Tell me about your trading habits...` |
| 任意一般文字 | Planning → Market Analysis → Analysis Results |

### 5.2 Draft Order（關鍵字）

| 使用者輸入 | 結果 |
|------------|------|
| 含 `draft order`（不分大小寫） | 分析動畫 → Draft Order 卡（含 TP／SL） |
| 含 `no tp/sl` 或 `no tp sl` | Draft Order 卡，TP／SL 為 **ADD** |

#### Draft Order 卡（未 Deposit）

- 提示：Deposit to Submit + 餘額說明
- CTA：**Deposit**
- 點 Deposit → Deposit Select（Approve & Deposit）

#### Approve & Deposit 之後

- 回 Home，banner：`You have 2 draft orders`（可 View／關閉）
- 之後再觸發 draft／no tp/sl：
  - 提示改為：You can review and modify before submission. / No order will be sent until you confirm.
  - CTA：左 **Send Order**（主）、右 **Modify**

#### no tp/sl 子流程

1. 出現空 TP／SL + **ADD**
2. 點 ADD → 自動送出詢問設定 TP／SL
3. Agent 建議數值 + **Yes**／**No**
4. Yes → 填回 Draft Order 的 Take Profit／Stop Loss

建議數值（demo）：

- Take Profit：`120,800 · +12 USDC`
- Stop Loss：`107,380 · −6 USDC`

### 5.3 More

| Tab | 內容 |
|-----|------|
| History | 假歷史對話；可刪除；可 Rename Trader DNA |
| Draft Orders | ETH／BTC 兩筆 draft；詳情 CTA：左 Ask agent、右 Send Order |

- Ask agent → 送出 `Review my {title} draft order`（會走 draft 流程）
- Home banner **View** → 直接開 More 的 Draft Orders

### 5.4 Signal

1. Home **View Signal** → 列表（Titan／Sage／Vanguard）
2. View more → 詳情
3. **Ask Agent** → 聊天（含 signal snapshot）
4. **Trade Now** → 開啟 Trade Perps 下單面板，並在旁邊顯示該信號的數據視窗（`SignalTradeModal`）

> **註記：** Signal → Trade Now 後，信號數據視窗會顯示在下單面板旁邊（非另開獨立全螢幕）。

### 5.5 Agent 下單成功通知

- Confirm order 確認送出後，顯示一則無 icon 的頂部通知：`Order submitted`（約 3.2s）

---

## 6. 關鍵字／Magic String 一覽

| 字串 | 用途 |
|------|------|
| `new` / `old` | Email 帳號 |
| `111111` | 驗證碼 |
| `fail@test.com` | 寄碼失敗 |
| `000000` | 碼過期 |
| `>new user` / `old user` | Wallet QC |
| `draft order` | Draft Order demo |
| `no tp/sl` | 無 TP／SL + ADD 流程 |
| `Review my BTC Long draft order` | More → Ask agent |
| `Should I buy BTC right now?` 等 | Chip 建議 |
| `You have 2 draft orders` | Deposit 後 banner |

---

## 7. 主要程式路徑

### Onboarding

- `app/packages/onboarding/OnboardingDialog.tsx`
- `app/packages/onboarding/assets.ts`
- `app/packages/onboarding/EmailAuthModal.tsx`
- `app/packages/onboarding/WalletConnectModal.tsx`
- `app/packages/onboarding/ReferralCodePanel.tsx`
- `app/packages/onboarding/SetupAccountPanel.tsx`
- `app/packages/onboarding/SignMessageModal.tsx`
- `app/packages/onboarding/AddFundsPanel.tsx`
- `app/packages/onboarding/EnableTradingPanel.tsx`
- `app/packages/onboarding/TraderDnaLiveModal.tsx`
- `app/packages/onboarding/OnboardingShell.tsx`

### Agent

- `app/packages/agent/AgentOverlay.tsx`
- `app/packages/agent/AgentChatDialog.tsx`
- `app/packages/agent/DesktopTraderDnaPanel.tsx`
- `app/packages/agent/AgentConversationView.tsx`
- `app/packages/agent/draft-order.ts`
- `app/packages/agent/DraftOrderCard.tsx`
- `app/packages/agent/DepositSelectModal.tsx`
- `app/packages/agent/MoreViews.tsx`
- `app/packages/agent/SignalViews.tsx`
- `app/packages/agent/SignalTradeModal.tsx`

### 路由

- `app/routes/_index.tsx`

---

## 8. 建議演示路徑（QC）

### 路徑 A — 新用戶 Email

1. Connect wallet → Continue with Email  
2. Email：`new` → Code：`111111`  
3. Referral：Skip for Now  
4. Setup Continue → Sign → Continue → Sign → Funds Done  
5. Explore Now → Agent  

### 路徑 B — 舊用戶 Email

1. Continue with Email → `old` → `111111`  
2. Enable trading → Explore Now  

### 路徑 C — Draft + Deposit

1. Agent 輸入 `draft order`  
2. Deposit → Approve & Deposit  
3. Home 看 banner → View  
4. 再輸入 `draft order`，確認 CTA 為 Send Order／Modify  

### 路徑 D — No TP／SL

1. 輸入 `no tp/sl`  
2. 點 ADD → Yes → 確認 TP／SL 填入  

### 路徑 E — Signal

1. View Signal → 開詳情 → Ask Agent 或 Trade Now  
2. Trade Now → 確認下單面板旁顯示信號數據視窗  

---

## 9. 非目標（Out of scope）

- 真實錢包簽名、鏈上入金、訂單成交
- 後端 API／持久化帳號
- 生產環境資安與合規流程

---

## 10. 客戶溝通用一句話

> 這是 Dexless 的前端 demo：用 `new`／`old` + 驗證碼 `111111` 走完登入；在 Agent 輸入 `draft order` 或 `no tp/sl` 可看下單草稿與 TP／SL 互動。
