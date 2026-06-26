<script setup>
import BaseButton from './BaseButton.vue'
import HeartButton from './HeartButton.vue'
import { useCart } from '../../composables/useCart.js'

/**
 * ProductCard — a single product card for the best-sellers slider
 * (and any future catalogue grid).
 *
 * Now fully functional, mirroring JuiceCard on the СОКИ page:
 *   - the heart toggles the product in favorites (shared store)
 *   - «В корзину» adds the product and opens the cart popup
 *
 * Accepts the whole product object so it has everything the cart
 * needs (id, title, volume, price, image, bonus, ...).
 */
const props = defineProps({
  product: { type: Object, required: true }
})

const cart = useCart()

function addToCart() {
  cart.add(props.product)
  cart.open()
}
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <img :src="product.image" :alt="product.title" class="product-card__img" />
      <img
        v-if="product.bonus"
        src="/images/bonuses.png"
        alt="Бонусные баллы"
        class="product-card__bonus"
      />
    </div>

    <h3 class="product-card__title">{{ product.title }}</h3>
    <p class="product-card__volume">{{ product.volume }}</p>

    <div class="product-card__price-row">
      <span class="product-card__price">{{ product.price }}<span class="product-card__price-currency">₽</span></span>
      <HeartButton :product-id="product.id" :size="22" />
    </div>

    <BaseButton variant="primary" size="md" class="product-card__cta" @click="addToCart">В корзину</BaseButton>
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

/* ----- CTA ----- */
.product-card__cta { margin-top: auto; }
</style>
