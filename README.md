# NOVA CART (Antigravity Edition) ⚡🛒
> **High-Retention Local Quick-Commerce Platform connecting customers with 620+ neighbourhood stores across Bengaluru, Mumbai, and Delhi-NCR.**

---

## 1. Overview & Business Turnaround Strategy

### The Crisis Solved
Over the last 6 months, NOVA CART experienced high top-line registration growth (+46%), but suffered severe operational and unit-economic breakdowns:
- **Repeat Purchase Rate dropped from 41% → 27%** due to discount-driven churn.
- **Average Delivery Time lengthened from 29 min → 37 min** due to inaccurate promises and store bottlenecks.
- **Order Cancellation Rate surged from 6% → 11%** due to out-of-stock items after checkout.
- **Support Tickets soared from 3,100 → 5,900 / month** from delayed orders and missing items.
- **Promo Spend rose 79% (₹9.5L → ₹17.0L)** while revenue rose only 20% (₹21.8L → ₹26.1L), burning capital without building retention.

### The NOVA CART Solution
NOVA CART rebuilds customer trust not by burning larger discounts, but through **hyper-local reliability, honest communication, and neighbourhood loyalty rewards**:
1. **Section 7 Delivery-Time Message & Honesty Rule**: Dynamic ETA calculated from packing time, road transit, and distance. If an order estimate exceeds 30 minutes, NOVA CART refuses to show fake "10–30 min" promises and displays the genuine range (e.g., `35–42 min*`) with clear reasoning badges (`[High Demand]` or `[Far from Store]`).
2. **Availability Confidence & Pre-Failure Substitutions (Section 12)**: Every product displays verified stock confidence (`✅ Confirmed In Stock`, `🟡 Medium Stock`, `🔴 Rare Stock`). Customers choose substitute preferences (*"Replace with similar"*, *"Ask me on chat"*, or *"Remove if unavailable"*) before placing orders, preventing post-checkout cancellations.
3. **3-Token Free Delivery System & ₹2,000 Milestone Rule (Section 5)**: Every customer receives a 3-token free delivery wallet (`🚚 🚚 ⚪`). Orders of ₹2,000 or more unlock celebration-grade free delivery **without consuming a free-delivery token**, incentivizing larger basket sizes and preserving tokens for subsequent repeat purchases.
4. **Proactive Delay Compensation (Section 8)**: If any order slips past its estimated delivery window by >5 minutes, NOVA CART proactively apologizes and instantly credits **₹30 to the customer's NOVA Wallet**, turning frustration into delight.
5. **Interactive Scratch Card & Local Loyalty Stamps (Section 9 & 13)**: Orders of ₹500+ unlock an interactive HTML5 canvas scratch card with repeat-order perks. Local neighbourhood stores offer stamp cards (e.g. *5 orders at Sri Sai Supermarket = Free Jaggery*), cementing local habits.
6. **Executive Promo Guardrails (Section 10)**: Real-time administrative guardrail monitoring alerts management whenever monthly promo spend exceeds 35% of revenue, capping welcome discounts to ₹150 (MOV ₹199).

---

## 2. Key Business & Product Logic

### 2.1 New-Customer Welcome Offer (Section 4)
- **Eligibility**: Triggered exclusively upon customer registration via Sign-up.
- **Perks**:
  - **3 Free Deliveries**: Token wallet initialized to 3 tokens (no minimum order value required). A token is consumed only when an order is **delivered safely** (not on cancellations).
  - **50% OFF First Order**: Auto-applied at checkout (no coupon code required).
  - **Guardrail Enforced**: 50% discount capped at ₹150 with a Minimum Order Value of ₹199.
  - **Stacking Rule**: 50% discount + Free Delivery (1 of 3) + ₹500+ Scratch Card. Any reward earned from the scratch card can only be redeemed from the **2nd order onward**.
  - **Anti-Abuse Verification**: Device ID, phone OTP, and address fingerprinting prevents duplicate account creation.

### 2.2 Free-Delivery Wallet & ₹2,000 Rule (Section 5)
- All logged-in customers have access to their 3-icon tracker in the header and checkout (`🚚 🚚 ⚪`).
- **₹2,000 Free Delivery Rule**:
  - Cart progress bar dynamically calculates `amountNeededFor2k = Math.max(0, 2000 - itemTotal)`.
  - When cart reaches ₹2,000, celebratory confetti triggers and delivery fee is set to ₹0 **without deducting any free-delivery token**.
- When 0 tokens remain and cart is under ₹2,000, standard delivery fee is ₹35, with prompts showing how to earn more tokens via ₹500+ scratch cards.

### 2.3 Delivery-Time Message & Honesty Rule (Section 7)
- **Standard Headline**: `"Receive your order within 10–30 min*"`
- **Footnote**: `"*Delivery time is based on your delivery location."`
- **Dynamic Formula**:
  $$\text{ETA} = \text{Store Packing Time (5-12 min)} + (\text{Distance in km} \times \text{Transit Multiplier (3.2 min/km)})$$
- **Honesty Rule**: If calculated ETA > 30 minutes (e.g. stores >6 km away or peak weather demand), the app suppresses the 10-30 min copy and displays the true range (e.g., `36–44 min*`) with an explanation tag (`[High Demand]` or `[Far from Store]`).

### 2.4 Live Order Tracking & Simulation (Section 8)
- Real-time animated status timeline:
  `Order Placed` ➔ `Store Confirmed (Stock Reserved)` ➔ `Packing` ➔ `Delivery Partner Assigned` ➔ `Out for Delivery` ➔ `Delivered`.
- Interactive Leaflet OpenStreetMap rendering store marker, customer destination, and moving EV delivery rider.
- Live ETA countdown that synchronizes with rider movement.
- Partner card with EV vehicle plate, photo, rating, and mock masked calling/chat.
- Automated or manual 5-min delay test triggering `₹30 wallet compensation`.

### 2.5 Scratch-Card Rewards (Section 9)
- Unlocked for qualifying orders of ₹500 or more.
- Built using an interactive HTML5 `<canvas>` with metallic foil coating.
- Swiping across the card with mouse or finger clears the foil, revealing cash vouchers, free delivery tokens, or bonus points.
- Personalized greeting: *"Wow, great order! 🌟 You're a Nova Star. Scratch to see your reward!"*
- Vouchers saved to *My Rewards* wallet with expiry countdowns.

---

## 3. Technology Stack & Architecture

- **Frontend Core**: React 18, Vite (fast HMR, lightweight bundling)
- **Styling**: Tailwind CSS v3 with custom design tokens (Deep Indigo `#1e1b4b`, Emerald `#10b981`, Amber `#f59e0b`)
- **Routing**: React Router DOM v6
- **Maps**: Leaflet with OpenStreetMap tiles (zero API keys required, custom animated markers)
- **State Management**: Reactive React Context architecture with `localStorage` persistence:
  - `AuthContext`: Authentication, 3-token delivery wallet, new-user state, wallet credits.
  - `LocationContext`: Multi-city selector (Bengaluru, Mumbai, Delhi-NCR), GPS detection, Haversine distance engine.
  - `CartContext`: Cart operations, ₹2k milestone rule, substitute preferences, bill calculations.
  - `OrderContext`: Order creation, live tracking progression, delay compensation, toast notifications.
  - `SavedShopsContext`: My Neighbourhood saved stores.
  - `RewardsContext`: Interactive scratch cards, claimed vouchers, store stamps.
  - `AdminContext`: Stock toggles, demand forecasting, promo guardrails, support ticket management.
- **Icons**: Lucide React
- **Confetti & FX**: Canvas Confetti

---

## 4. Key Metrics to Track (KPI Dashboard)

To evaluate NOVA CART's turnaround success, track the following 6 core indicators:
1. **Repeat Purchase Rate**: Target increase from 27% back to **>45%** through My Neighbourhood saved shops and store stamp cards.
2. **2nd and 3rd Order Conversion of New Users**: Tracking repeat drop-off after the welcome offer is consumed.
3. **Average Delivery Time**: Rebounding from 37 min to **22–26 min**, with zero false delivery complaints due to the Honesty Rule.
4. **Order Cancellation Rate**: Slashing from 11% down to **<3%** via real-time availability confidence and pre-failure substitutes.
5. **Monthly Support Ticket Volume**: Cutting from 5,900/mo to **<2,200/mo** via 1-tap automated refunds and proactive ₹30 delay compensation.
6. **Promo Spend as % of Revenue**: Reducing burn from 65% (₹17L / ₹26.1L) to **under 25%**, refocusing spend on repeat loyalty rather than first-time acquisition discounts.

---

## 5. Local Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production validation
npm run build
```
The application will be live at `http://127.0.0.1:5173/`.
