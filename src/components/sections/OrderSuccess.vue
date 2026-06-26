<script setup>
/**
 * OrderSuccess — final screen of the checkout flow (after «Оплата»).
 *
 * Shows the confirmation heading with a green check, a delivery
 * message, and the loyalty bonus that will be credited for the order.
 *
 * The legal-information block and the «Присоединяйтесь к Vita Juice»
 * banner seen in the Figma frame are the site-wide AppFooter and
 * JoinUsBanner, already rendered globally — so they are intentionally
 * NOT duplicated here.
 *
 * Props:
 *   - bonus : points credited for this order (captured before the cart
 *             is cleared, so the value survives on this screen).
 */
defineProps({
  bonus: { type: Number, default: 0 }
})
</script>

<template>
  <div class="order-success">
    <!-- Heading + green check -->
    <div class="order-success__head">
      <h2 class="order-success__title">Успешный заказ</h2>
      <span class="order-success__check" aria-label="Заказ оформлен" role="img">
        <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#7AB81E" />
          <path
            d="M9 16.4 l4.6 4.6 L23.2 11"
            fill="none"
            stroke="#fff"
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <p class="order-success__subtitle">
      Ваш заказ успешно оформлен и будет доставлен
    </p>

    <!-- Bonus accrual row (bordered top & bottom with the page dashes) -->
    <div class="order-success__bonus">
      <span class="order-success__bonus-label">За этот заказ будет начислено</span>
      <span class="order-success__bonus-value">
        <svg class="coins" viewBox="0 0 64 44" width="44" height="30" aria-hidden="true">
          <g fill="#fff" stroke="var(--color-text)" stroke-width="2.6"
             stroke-linejoin="round" stroke-linecap="round">
            <!-- back coin -->
            <g transform="rotate(-12 40 20)">
              <path d="M24 16 a16 7 0 0 0 32 0 v6 a16 7 0 0 1 -32 0 z" />
              <ellipse cx="40" cy="16" rx="16" ry="7" />
            </g>
            <!-- front coin -->
            <g transform="rotate(-12 24 26)">
              <path d="M8 22 a16 7 0 0 0 32 0 v6 a16 7 0 0 1 -32 0 z" />
              <ellipse cx="24" cy="22" rx="16" ry="7" />
            </g>
          </g>
        </svg>
        {{ bonus }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.order-success { padding: 12px 0 8px; }

/* ---------- Heading ---------- */
.order-success__head {
  display: flex;
  align-items: center;
  gap: 18px;
}
.order-success__title {
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}
.order-success__check {
  width: clamp(28px, 4vw, 36px);
  height: clamp(28px, 4vw, 36px);
  flex: 0 0 auto;
  display: inline-flex;
}

.order-success__subtitle {
  font-size: clamp(15px, 2vw, 20px);
  color: var(--color-text);
  margin: 18px 0 0;
}

/* ---------- Bonus row ---------- */
.order-success__bonus {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 34px;
  padding: 26px 0;
  border-top: 3px dashed var(--color-text);
  border-bottom: 3px dashed var(--color-text);
}
.order-success__bonus-label {
  font-size: clamp(18px, 2.6vw, 30px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.order-success__bonus-value {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: clamp(24px, 3.4vw, 38px);
  font-weight: 800;
  white-space: nowrap;
}
.order-success__bonus-value .coins {
  width: clamp(36px, 5vw, 48px);
  height: auto;
}

/* ---------- Responsive ---------- */
@media (max-width: 600px) {
  .order-success__head { gap: 12px; }
  .order-success__bonus {
    gap: 12px;
    padding: 20px 0;
  }
}
</style>
