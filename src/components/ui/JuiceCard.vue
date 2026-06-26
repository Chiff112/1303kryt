<script setup>
import BaseButton from './BaseButton.vue'
import HeartButton from './HeartButton.vue'
import { useCartStore } from '../../stores/cart.js'

/**
 * JuiceCard — a product card on the category (juices) page.
 *
 * White card that lifts on hover. Clicking the card body opens the
 * product detail modal. The "В корзину" button and the heart act
 * independently (they don't open the modal).
 */
const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['open-detail'])

const cart = useCartStore()

function addToCart() {
  cart.add(props.product)
  cart.open()
}
function openDetail() {
  emit('open-detail', props.product)
}
</script>

<template>
  <article class="juice-card" @click="openDetail">
    <div class="juice-card__media">
      <img :src="product.image" :alt="product.title" class="juice-card__img" />
      <span v-if="product.bonus > 0" class="juice-card__bonus">+{{ product.bonus }} б</span>
    </div>

    <h3 class="juice-card__title">{{ product.title }}</h3>
    <p class="juice-card__volume">{{ product.volume }}</p>

    <div class="juice-card__price-row">
      <span class="juice-card__price">{{ product.price }}<span class="juice-card__cur">₽</span></span>
      <HeartButton :product-id="product.id" :size="22" />
    </div>

    <BaseButton variant="primary" size="md" class="juice-card__cta" @click.stop="addToCart">
      В корзину
    </BaseButton>
  </article>
</template>

<style scoped>
.juice-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24px 20px 28px;
  cursor: pointer;
  transition: transform var(--t-base), box-shadow var(--t-base);
}
.juice-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
}

.juice-card__media {
  position: relative;
  width: 100%;
  max-width: 220px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.juice-card__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.juice-card__bonus {
  position: absolute;
  top: 0;
  right: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-yellow);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.juice-card__title {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}
.juice-card__volume {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.juice-card__price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.juice-card__price {
  font-size: 22px;
  font-weight: 800;
}
.juice-card__cur { font-weight: 800; }
.juice-card__heart {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--t-fast);
}
.juice-card__heart:hover { transform: scale(1.15); }
.juice-card__heart img { width: 22px; height: 20px; object-fit: contain; }

.juice-card__cta { margin-top: auto; min-width: 150px; }
</style>
