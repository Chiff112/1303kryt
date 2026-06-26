<script setup>
import BaseButton from './BaseButton.vue'

/**
 * ProductCard — a single product card for the best-sellers slider
 * and any future catalogue grid.
 *
 * Shows:
 *   - product image (centered)
 *   - optional yellow "+20 б" bonus badge top-right of the image
 *   - title and volume
 *   - price + heart (wishlist toggle)
 *   - "В корзину" yellow button
 */
defineProps({
  title:  { type: String, required: true },
  image:  { type: String, required: true },
  volume: { type: String, default: '' },
  price:  { type: [Number, String], required: true },
  bonus:  { type: Boolean, default: false }
})
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img :src="image" :alt="title" class="product-card__img" />
      <img
        v-if="bonus"
        src="/images/bonuses.png"
        alt="Бонусные баллы"
        class="product-card__bonus"
      />
    </div>

    <h3 class="product-card__title">{{ title }}</h3>
    <p class="product-card__volume">{{ volume }}</p>

    <div class="product-card__price-row">
      <span class="product-card__price">{{ price }}<span class="product-card__price-currency">₽</span></span>
      <button class="product-card__heart" type="button" aria-label="В избранное">
        <img src="/images/heart.png" alt="" />
      </button>
    </div>

    <BaseButton variant="primary" size="md" class="product-card__cta">В корзину</BaseButton>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 12px 20px;
}

/* ----- Media ----- */
.product-card__media {
  position: relative;
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.product-card__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* "+20 б" bonus badge (image already contains the text) */
.product-card__bonus {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 56px;
  height: 56px;
  object-fit: contain;
}

/* ----- Text ----- */
.product-card__title {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.product-card__volume {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

/* ----- Price + heart row ----- */
.product-card__price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.product-card__price {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text);
}
.product-card__price-currency { font-weight: 800; }
.product-card__heart {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--t-fast);
}
.product-card__heart:hover { transform: scale(1.15); }
.product-card__heart img { width: 18px; height: 18px; }

/* ----- CTA ----- */
.product-card__cta { margin-top: auto; }
</style>
