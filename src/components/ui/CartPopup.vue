<script setup>
import { useCart } from '../../composables/useCart.js'

/**
 * CartPopup — slide-in basket panel.
 *
 * Lists each cart item with image, name, volume, ingredients, a
 * quantity stepper (− qty +), line price, and a delete (trash) button.
 * Dashed dividers separate items. A free "Бутылочка" gift line always
 * shows at 0 ₽, and a yellow "СУММА ЗАКАЗА" bar pins the total to the
 * bottom — all matching the Figma design.
 *
 * Reads/writes the shared cart store, so it stays in sync with the
 * header/footer summaries and the product cards.
 */

const cart = useCart()
</script>

<template>
  <transition name="cart">
    <div v-if="cart.isOpen.value" class="cart" @click.self="cart.close()">
      <aside class="cart__panel" role="dialog" aria-label="Корзина">
        <!-- Header -->
        <div class="cart__head">
          <h2 class="cart__title">Корзина</h2>
          <button class="cart__close" type="button" aria-label="Закрыть" @click="cart.close()">×</button>
        </div>

        <!-- Empty state -->
        <div v-if="cart.isEmpty.value" class="cart__empty">
          <p>Ваша корзина пуста</p>
          <span>Добавьте напитки из каталога</span>
        </div>

        <!-- Items (scrollable) -->
        <div v-else class="cart__items">
          <div v-for="item in cart.items.value" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.title" class="cart-item__img" />

            <div class="cart-item__info">
              <div class="cart-item__top">
                <h3 class="cart-item__title">{{ item.title }}</h3>
                <button
                  class="cart-item__delete"
                  type="button"
                  aria-label="Удалить"
                  @click="cart.remove(item.id)"
                >
                  <img src="/images/trash.png" alt="" />
                </button>
              </div>
              <p class="cart-item__volume">{{ item.volume }}</p>
              <p class="cart-item__ingredients">{{ item.ingredients }}</p>

              <div class="cart-item__bottom">
                <div class="cart-item__stepper">
                  <button type="button" aria-label="Меньше" @click="cart.decrement(item.id)">−</button>
                  <span>{{ item.qty }}</span>
                  <button type="button" aria-label="Больше" @click="cart.increment(item.id)">+</button>
                </div>
                <span class="cart-item__price">{{ item.price * item.qty }}₽</span>
              </div>
            </div>
          </div>

          <!-- Free bottle gift line -->
          <div class="cart__gift">
            <span class="cart__gift-label">Бутылочка</span>
            <img src="/images/gift.png" alt="" class="cart__gift-icon" />
            <span class="cart__gift-price">0₽</span>
          </div>
        </div>

        <!-- Total bar -->
        <div v-if="!cart.isEmpty.value" class="cart__total">
          <span class="cart__total-label">Сумма заказа</span>
          <span class="cart__total-value">{{ cart.totalPrice.value }}₽</span>
        </div>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.cart {
  position: fixed;
  inset: 0;
  background: rgba(130, 130, 130, 0.55);
  z-index: 300;
  display: flex;
  justify-content: flex-end;
}

.cart__panel {
  width: min(540px, 92vw);
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.18);
}

/* Header */
.cart__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  flex: 0 0 auto;
}
.cart__title {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}
.cart__close {
  font-size: 28px;
  line-height: 1;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Empty */
.cart__empty {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 40px;
}
.cart__empty p {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  color: var(--color-text);
}

/* Items list (scrollable) */
.cart__items {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0 28px;
}

.cart-item {
  display: flex;
  gap: 18px;
  padding: 22px 0;
  border-bottom: 3px dashed var(--color-text);
}
.cart-item__img {
  flex: 0 0 auto;
  width: 110px;
  height: 130px;
  object-fit: contain;
  align-self: center;
}
.cart-item__info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.cart-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.cart-item__title {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin: 0;
  line-height: 1.15;
}
.cart-item__delete {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity var(--t-fast);
}
.cart-item__delete:hover { opacity: 1; }
.cart-item__delete img { width: 20px; height: 20px; }

.cart-item__volume {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  margin: 8px 0 4px;
}
.cart-item__ingredients {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0 0 14px;
  line-height: 1.35;
}

.cart-item__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}
.cart-item__stepper {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: var(--color-yellow);
  border-radius: var(--radius-pill);
  padding: 6px 16px;
}
.cart-item__stepper button {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.cart-item__stepper span {
  font-size: 16px;
  font-weight: 700;
  min-width: 14px;
  text-align: center;
}
.cart-item__price {
  font-size: 22px;
  font-weight: 800;
}

/* Gift line */
.cart__gift {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 0;
}
.cart__gift-label {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.cart__gift-icon { width: 22px; height: 22px; object-fit: contain; }
.cart__gift-price {
  margin-left: auto;
  font-size: 22px;
  font-weight: 800;
}

/* Total bar */
.cart__total {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-yellow);
  padding: 22px 28px;
}
.cart__total-label {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.cart__total-value {
  font-size: 22px;
  font-weight: 800;
}

/* Transition */
.cart-enter-active, .cart-leave-active { transition: opacity var(--t-base); }
.cart-enter-from, .cart-leave-to       { opacity: 0; }
.cart-enter-active .cart__panel,
.cart-leave-active .cart__panel        { transition: transform var(--t-base); }
.cart-enter-from   .cart__panel        { transform: translateX(100%); }
.cart-leave-to     .cart__panel        { transform: translateX(100%); }
</style>
