<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import HeartButton from './HeartButton.vue'
import { useCartStore } from '../../stores/cart.js'

// Окно с подробностями о товаре: фото, состав, размер, цена,
// пищевая ценность, сердечко и кнопка «В корзину».
const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['close'])

const cart = useCartStore()

const sizes = computed(() => props.product.sizes ?? [props.product.volume])
const activeSize = ref(props.product.volume || sizes.value[0])

function addToCart() {
  cart.add({ ...props.product, volume: activeSize.value })
  cart.open()
  emit('close')
}
function close() { emit('close') }
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="detail" role="dialog" aria-modal="true" :aria-label="product.title">
      <button class="detail__close" type="button" aria-label="Закрыть" @click="close">×</button>

      <!-- Слева: фото -->
      <div class="detail__media">
        <img :src="product.image" :alt="product.title" class="detail__img" />
      </div>

      <!-- Справа: информация -->
      <div class="detail__info">
        <h2 class="detail__title">{{ product.title }}</h2>

        <!-- Кнопки размера -->
        <div class="detail__sizes">
          <button
            v-for="size in sizes"
            :key="size"
            class="detail__size"
            :class="{ 'is-active': size === activeSize }"
            type="button"
            @click="activeSize = size"
          >{{ size }}</button>
        </div>

        <!-- Состав -->
        <div class="detail__block">
          <h3 class="detail__heading">Ингридиенты</h3>
          <p class="detail__text">{{ product.ingredients }}</p>
        </div>

        <!-- Пищевая ценность -->
        <div v-if="product.nutrition" class="detail__block">
          <h3 class="detail__heading">Пищевая ценность на 100г</h3>
          <ul class="detail__nutrition">
            <li><span>Белки:</span> {{ product.nutrition.protein }}</li>
            <li><span>Жиры:</span> {{ product.nutrition.fat }}</li>
            <li><span>Углеводы:</span> {{ product.nutrition.carbs }}</li>
          </ul>
        </div>

        <!-- Срок годности -->
        <div v-if="product.shelfLife" class="detail__block">
          <h3 class="detail__heading">Срок хранения</h3>
          <p class="detail__text">{{ product.shelfLife }}</p>
        </div>

        <!-- Хранение -->
        <div v-if="product.storage" class="detail__block">
          <h3 class="detail__heading">Условия хранения</h3>
          <p class="detail__text">{{ product.storage }}</p>
        </div>

        <!-- Цена и кнопки -->
        <div class="detail__footer">
          <span class="detail__price">{{ product.price }}<span class="detail__cur">₽</span></span>
          <HeartButton :product-id="product.id" :size="28" />
          <BaseButton variant="primary" size="lg" class="detail__cta" @click="addToCart">
            В корзину
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(130, 130, 130, 0.55);
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail {
  position: relative;
  width: 100%;
  max-width: 1000px;
  max-height: 92vh;
  overflow-y: auto;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.detail__close {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 30px;
  line-height: 1;
  width: 40px;
  height: 40px;
  color: var(--color-text);
  z-index: 2;
}

/* Фото */
.detail__media {
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail__img {
  max-width: 100%;
  max-height: 440px;
  object-fit: contain;
}

/* Информация */
.detail__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.detail__title {
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

/* Кнопки размера */
.detail__sizes {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}
.detail__size {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-muted);
  padding: 2px 0;
  border-bottom: 2px solid transparent;
  transition: color var(--t-fast), border-color var(--t-fast);
}
.detail__size:hover { color: var(--color-text); }
.detail__size.is-active {
  color: var(--color-text);
  border-bottom-color: var(--color-yellow);
}

/* Блоки с текстом */
.detail__block { display: flex; flex-direction: column; gap: 4px; }
.detail__heading {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.detail__text {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}
.detail__nutrition {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.detail__nutrition li {
  font-size: 14px;
  color: var(--color-text-muted);
}
.detail__nutrition span { display: inline-block; min-width: 90px; }

/* Низ окна */
.detail__footer {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.detail__price {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 800;
}
.detail__cur { font-weight: 800; }
.detail__heart {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--t-fast);
}
.detail__heart:hover { transform: scale(1.12); }
.detail__heart img { width: 28px; height: 26px; object-fit: contain; }
.detail__cta { margin-left: auto; }

/* Адаптив (под телефоны) */
@media (max-width: 820px) {
  .detail {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 28px 24px;
  }
  .detail__img { max-height: 280px; }
  .detail__cta { margin-left: 0; }
}
</style>
