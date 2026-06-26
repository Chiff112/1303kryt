<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart.js'
import BaseButton from '../ui/BaseButton.vue'

// Страница корзины и оформления заказа из трёх шагов:
// 1) Корзина  2) Оформление (адрес)  3) Оплата (телефон + код).
// Работает с общим стором корзины.

const cart = useCartStore()
const router = useRouter()

const STEPS = ['cart', 'checkout', 'payment']
const step = ref('cart')

function goStep(s) {
  // нельзя перескочить вперёд с пустой корзиной
  if (cart.isEmpty && s !== 'cart') return
  step.value = s
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------------- Шаг 1: промокод ---------------- */
const promoInput = ref('')
const promoMsg = ref(null)
const showPromoInfo = ref(false)
function applyPromo() {
  const res = cart.applyPromo(promoInput.value)
  promoMsg.value = res
}

/* ---------------- Шаг 2: адрес доставки ---------------- */
const address = reactive({
  street: '', building: '', entrance: '', floor: '', flat: '', intercom: '', comment: ''
})
const addressTried = ref(false)
const addressErrors = computed(() => ({
  street:   addressTried.value && !address.street.trim(),
  building: addressTried.value && !address.building.trim(),
  entrance: addressTried.value && !address.entrance.trim(),
  floor:    addressTried.value && !address.floor.trim(),
  flat:     addressTried.value && !address.flat.trim()
  // домофон и комментарий — необязательные
}))
function saveAddress() {
  addressTried.value = true
  const hasError = Object.values(addressErrors.value).some(Boolean)
  if (hasError) return
  goStep('payment')
}

/* ---------------- Шаг 3: оплата ---------------- */
const payment = reactive({ phone: '', name: '', code: '', useBonus: '' })
const codeSent = ref(false)
const paymentTried = ref(false)
const paymentErrors = computed(() => ({
  phone: paymentTried.value && !payment.phone.trim(),
  name:  paymentTried.value && !payment.name.trim(),
  code:  paymentTried.value && codeSent.value && !payment.code.trim()
}))
const paid = ref(false)

function sendCode() {
  paymentTried.value = true
  if (!payment.phone.trim() || !payment.name.trim()) return
  codeSent.value = true
  paymentTried.value = false
}
function pay() {
  paymentTried.value = true
  if (!payment.phone.trim() || !payment.name.trim() || !payment.code.trim()) return
  paid.value = true
  cart.clear()
}

// Сколько бонусов можно списать (не больше баланса и суммы заказа)
const bonusToUse = computed(() => {
  const n = parseInt(payment.useBonus, 10)
  if (Number.isNaN(n) || n < 0) return 0
  return Math.min(n, cart.totalBonus, cart.totalPrice)
})
const finalTotal = computed(() => cart.grandTotal - bonusToUse.value)
</script>

<template>
  <section class="cart-page">
    <!-- Плашка с шагами -->
    <div class="stepper">
      <div class="stepper__inner container">
        <button
          v-for="(s, i) in STEPS"
          :key="s"
          class="stepper__tab"
          :class="{ 'is-active': step === s }"
          type="button"
          @click="goStep(s)"
        >{{ ['Корзина', 'Оформление', 'Оплата'][i] }}</button>
      </div>
    </div>

    <div class="container cart-page__body">
      <!-- ================= ШАГ 1: КОРЗИНА ================= -->
      <template v-if="step === 'cart'">
        <div v-if="cart.isEmpty" class="cart-page__empty">
          <p>Ваша корзина пуста</p>
          <BaseButton variant="primary" size="md" @click="router.push('/juices')">В каталог</BaseButton>
        </div>

        <template v-else>
          <!-- Товары -->
          <div class="cart-line" v-for="item in cart.items" :key="item.id + item.volume">
            <img :src="item.image" :alt="item.title" class="cart-line__img" />
            <div class="cart-line__info">
              <div class="cart-line__head">
                <h3 class="cart-line__title">{{ item.title }}</h3>
                <button class="cart-line__del" type="button" aria-label="Удалить" @click="cart.remove(item.id, item.volume)">
                  <img src="/images/trash.png" alt="" />
                </button>
              </div>
              <p class="cart-line__volume">{{ item.volume }}</p>
              <p class="cart-line__ingredients">{{ item.ingredients }}</p>
              <div class="cart-line__bottom">
                <div class="stepper-pill">
                  <button type="button" aria-label="Меньше" @click="cart.decrement(item.id, item.volume)">−</button>
                  <span>{{ item.qty }}</span>
                  <button type="button" aria-label="Больше" @click="cart.increment(item.id, item.volume)">+</button>
                </div>
                <span class="cart-line__price">{{ item.price * item.qty }}₽</span>
              </div>
            </div>
          </div>

          <!-- Промокод -->
          <div class="promo">
            <input
              v-model="promoInput"
              class="promo__input"
              type="text"
              placeholder="Промокод"
            />
            <button class="promo__info" type="button" aria-label="О промокоде"
              @mouseenter="showPromoInfo = true" @mouseleave="showPromoInfo = false"
              @click="showPromoInfo = !showPromoInfo">i</button>
            <p v-if="showPromoInfo" class="promo__tooltip">
              Введите промокод при оформлении заказа на сумму от 1500 рублей и получите
              скидку 15%. Промокод можно использовать только 1 раз во время проведения акции.
            </p>
            <BaseButton variant="primary" size="md" @click="applyPromo">Применить</BaseButton>
          </div>
          <p v-if="promoMsg" class="promo__msg" :class="{ 'is-ok': promoMsg.ok }">{{ promoMsg.message }}</p>

          <!-- Подарок-бутылочка -->
          <div class="summary-row summary-row--gift">
            <span class="summary-row__label">Бутылочка</span>
            <img src="/images/gift.png" alt="" class="summary-row__gift-icon" />
            <span class="summary-row__value">0₽</span>
          </div>

          <!-- Скидка (если есть промокод) -->
          <div v-if="cart.discount" class="summary-row">
            <span class="summary-row__label">Скидка по промокоду</span>
            <span class="summary-row__value">−{{ cart.discount }}₽</span>
          </div>

          <!-- Итого -->
          <div class="summary-row summary-row--total">
            <span class="summary-row__label">Сумма заказа</span>
            <span class="summary-row__value">{{ cart.totalPrice }}₽</span>
          </div>

          <div class="cart-page__cta">
            <BaseButton variant="primary" size="lg" @click="goStep('checkout')">Оформить</BaseButton>
          </div>
        </template>
      </template>

      <!-- ================= ШАГ 2: ОФОРМЛЕНИЕ ================= -->
      <template v-else-if="step === 'checkout'">
        <div class="addr-grid">
          <div class="addr-field">
            <label>Улица</label>
            <div class="addr-control">
              <input v-model="address.street" :class="{ 'is-error': addressErrors.street }" />
              <span v-if="addressErrors.street" class="addr-error">Пожалуйста введите улицу</span>
            </div>
          </div>
          <div class="addr-field">
            <label>Подъезд</label>
            <div class="addr-control">
              <input v-model="address.entrance" :class="{ 'is-error': addressErrors.entrance }" />
              <span v-if="addressErrors.entrance" class="addr-error">Пожалуйста введите № подъезда</span>
            </div>
          </div>
          <div class="addr-field">
            <label>Кв/оф</label>
            <div class="addr-control">
              <input v-model="address.flat" :class="{ 'is-error': addressErrors.flat }" />
              <span v-if="addressErrors.flat" class="addr-error">Пожалуйста введите № Кв/оф</span>
            </div>
          </div>
          <div class="addr-field">
            <label>Корпус</label>
            <div class="addr-control">
              <input v-model="address.building" :class="{ 'is-error': addressErrors.building }" />
              <span v-if="addressErrors.building" class="addr-error">Пожалуйста введите № корпуса</span>
            </div>
          </div>
          <div class="addr-field">
            <label>Этаж</label>
            <div class="addr-control">
              <input v-model="address.floor" :class="{ 'is-error': addressErrors.floor }" />
              <span v-if="addressErrors.floor" class="addr-error">Пожалуйста введите этаж</span>
            </div>
          </div>
          <div class="addr-field">
            <label>Домофон</label>
            <div class="addr-control">
              <input v-model="address.intercom" placeholder="" />
            </div>
          </div>
        </div>

        <div class="comment">
          <h3 class="comment__title">Комметарий к заказу</h3>
          <textarea v-model="address.comment" class="comment__box"></textarea>
          <BaseButton variant="primary" size="md" class="comment__save" @click="saveAddress">Сохранить</BaseButton>
        </div>

        <div class="cart-page__cta">
          <BaseButton variant="primary" size="lg" @click="saveAddress">Оплата</BaseButton>
        </div>
      </template>

      <!-- ================= ШАГ 3: ОПЛАТА ================= -->
      <template v-else-if="step === 'payment'">
        <div v-if="paid" class="cart-page__done">
          <h2>Заказ оплачен 🎉</h2>
          <p>Спасибо! Мы уже готовим ваш заказ.</p>
          <BaseButton variant="primary" size="md" @click="router.push('/')">На главную</BaseButton>
        </div>

        <template v-else>
          <!-- Состав заказа -->
          <div class="summary-row">
            <span class="summary-row__label summary-row__label--lg">Сумма заказа</span>
            <span class="summary-row__value summary-row__value--lg">{{ cart.totalPrice }}₽</span>
          </div>
          <div class="summary-row summary-row--bonus">
            <span class="summary-row__sub">Списать бонусов</span>
            <input v-model="payment.useBonus" class="bonus-input" type="number" min="0"
              :max="cart.totalBonus" :placeholder="String(cart.totalBonus)" />
          </div>

          <div class="summary-row">
            <span class="summary-row__label summary-row__label--lg">Доставка</span>
            <span class="summary-row__value summary-row__value--lg">{{ cart.delivery }}₽</span>
          </div>

          <div class="summary-row summary-row--final">
            <span class="summary-row__label">Итого к оплате</span>
            <span class="summary-row__value">{{ finalTotal }}₽</span>
          </div>

          <!-- Телефон / имя / код -->
          <div class="pay-form">
            <div class="pay-fields">
              <div class="pay-field">
                <label>Телефон</label>
                <div class="pay-control">
                  <input v-model="payment.phone" :class="{ 'is-error': paymentErrors.phone }" placeholder="+7(_)" />
                  <span v-if="paymentErrors.phone" class="addr-error">Введите телефон</span>
                </div>
              </div>
              <div class="pay-field">
                <label>Имя</label>
                <div class="pay-control">
                  <input v-model="payment.name" :class="{ 'is-error': paymentErrors.name }" />
                  <span v-if="paymentErrors.name" class="addr-error">Введите имя</span>
                </div>
              </div>
              <div class="pay-field">
                <label>Код из sms</label>
                <div class="pay-control">
                  <input v-model="payment.code" :class="{ 'is-error': paymentErrors.code }" :disabled="!codeSent" />
                  <span v-if="paymentErrors.code" class="addr-error">Введите код из sms</span>
                </div>
              </div>
            </div>

            <div class="pay-side">
              <BaseButton v-if="!codeSent" variant="primary" size="md" @click="sendCode">Выслать код</BaseButton>
              <p class="pay-agreement">
                Продолжая Вы соглашаетесь с пользовательским соглашением и политикой
                обработки персональных данных
              </p>
            </div>
          </div>

          <div class="cart-page__cta">
            <BaseButton variant="primary" size="lg" @click="pay">Оплатить</BaseButton>
          </div>
        </template>
      </template>
    </div>
  </section>
</template>

<style scoped>
.cart-page { background: #fff; }

/* ---------- Плашка с шагами ---------- */
.stepper {
  background: var(--color-green);
  margin-bottom: 32px;
}
.stepper__inner {
  display: flex;
  align-items: center;
  gap: clamp(16px, 5vw, 80px);
  padding-top: 18px;
  padding-bottom: 18px;
}
.stepper__tab {
  font-size: clamp(20px, 3.4vw, 40px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.45);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.stepper__tab.is-active { color: #fff; }
.stepper__tab:hover { color: rgba(255, 255, 255, 0.8); }

.cart-page__body { padding-bottom: 48px; }

/* ---------- Пустая корзина / готово ---------- */
.cart-page__empty,
.cart-page__done {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.cart-page__empty p,
.cart-page__done h2 {
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0;
}
.cart-page__done p { color: var(--color-text-muted); margin: 0; }

/* ---------- Строка товара ---------- */
.cart-line {
  display: flex;
  gap: 24px;
  padding: 26px 0;
  border-bottom: 3px dashed var(--color-text);
}
.cart-line__img {
  width: 130px;
  height: 150px;
  object-fit: contain;
  align-self: center;
  flex: 0 0 auto;
}
.cart-line__info { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.cart-line__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.cart-line__title {
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin: 0;
}
.cart-line__del { width: 28px; height: 28px; opacity: 0.7; transition: opacity var(--t-fast); }
.cart-line__del:hover { opacity: 1; }
.cart-line__del img { width: 22px; height: 22px; }
.cart-line__volume { font-size: 15px; font-weight: 700; margin: 10px 0 4px; }
.cart-line__ingredients { font-size: 14px; color: var(--color-text-muted); margin: 0 0 16px; }
.cart-line__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
}
.cart-line__price { font-size: 24px; font-weight: 800; }

/* Счётчик количества (общий стиль) */
.stepper-pill {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--color-yellow);
  border-radius: var(--radius-pill);
  padding: 8px 18px;
}
.stepper-pill button {
  font-size: 18px;
  font-weight: 700;
  width: 18px; height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.stepper-pill span { font-size: 16px; font-weight: 700; min-width: 14px; text-align: center; }

/* ---------- Промокод ---------- */
.promo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 0;
  border-bottom: 3px dashed var(--color-text);
  position: relative;
  flex-wrap: wrap;
}
.promo__input {
  flex: 1 1 200px;
  border: none;
  border-bottom: 3px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  padding: 4px 0 8px;
  outline: none;
  min-width: 0;
}
.promo__input:focus { border-bottom-color: var(--color-green); }
.promo__info {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 2px solid var(--color-text);
  font-style: italic;
  font-weight: 700;
  font-size: 18px;
  flex: 0 0 auto;
}
.promo__tooltip {
  position: absolute;
  top: 100%;
  left: 220px;
  z-index: 5;
  max-width: 360px;
  background: #fff;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  padding: 12px 16px;
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.4;
}
.promo__msg { margin: 10px 0 0; font-size: 14px; font-weight: 600; color: var(--color-red); }
.promo__msg.is-ok { color: var(--color-green); }

/* ---------- Строки с суммами ---------- */
.summary-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 0;
  border-bottom: 3px dashed var(--color-text);
}
.summary-row__label {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.summary-row__label--lg { font-size: 22px; }
.summary-row__gift-icon { width: 24px; height: 24px; }
.summary-row__value {
  margin-left: auto;
  font-size: 22px;
  font-weight: 800;
}
.summary-row__value--lg { font-size: 24px; }
.summary-row--total .summary-row__value,
.summary-row--total .summary-row__label { font-size: 22px; }
.summary-row--gift { border-bottom: 3px dashed var(--color-text); }

.summary-row--bonus {
  justify-content: flex-end;
  border-bottom: 3px dashed var(--color-text);
}
.summary-row__sub {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}
.bonus-input {
  width: 120px;
  border: none;
  border-bottom: 3px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  text-align: right;
  padding: 2px 0 6px;
  outline: none;
}

/* Жёлтая полоса «Итого к оплате» */
.summary-row--final {
  background: var(--color-yellow);
  border: none;
  padding: 22px;
  margin: 4px 0;
}

/* ---------- Кнопка ---------- */
.cart-page__cta {
  display: flex;
  justify-content: center;
  padding: 32px 0 8px;
}

/* ---------- Форма адреса (шаг 2) ---------- */
.addr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 40px;
  padding: 8px 0 24px;
  border-bottom: 3px dashed var(--color-text);
}
.addr-field { display: flex; align-items: baseline; gap: 16px; }
.addr-field label {
  flex: 0 0 90px;
  font-size: 20px;
  color: var(--color-text);
}
.addr-control { flex: 1 1 auto; min-width: 0; }
.addr-control input {
  width: 100%;
  border: none;
  border-bottom: 3px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  padding: 2px 0 6px;
  outline: none;
}
.addr-control input:focus { border-bottom-color: var(--color-green); }
.addr-control input.is-error { border-bottom-color: var(--color-red); }
.addr-error { display: block; color: var(--color-red); font-size: 12px; font-weight: 600; margin-top: 2px; }

.comment { padding: 24px 0 0; }
.comment__title { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
.comment__box {
  width: 100%;
  max-width: 420px;
  min-height: 120px;
  border: none;
  border-radius: var(--radius-md);
  background: #EFEFEF;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  outline: none;
}
.comment__save { margin-top: 16px; }

/* ---------- Оплата (шаг 3) ---------- */
.pay-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 28px 0 8px;
}
.pay-fields { display: flex; flex-direction: column; gap: 16px; }
.pay-field { display: flex; align-items: baseline; gap: 16px; }
.pay-field label {
  flex: 0 0 130px;
  font-size: 20px;
}
.pay-control { flex: 1 1 auto; min-width: 0; }
.pay-control input {
  width: 100%;
  border: none;
  border-bottom: 3px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  padding: 2px 0 6px;
  outline: none;
}
.pay-control input:focus { border-bottom-color: var(--color-green); }
.pay-control input.is-error { border-bottom-color: var(--color-red); }
.pay-control input:disabled { opacity: 0.5; }
.pay-side { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.pay-agreement { font-size: 11px; color: var(--color-text-muted); line-height: 1.4; margin: 0; max-width: 260px; }

/* ---------- Адаптив (под телефоны) ---------- */
@media (max-width: 900px) {
  .addr-grid { grid-template-columns: 1fr; gap: 14px; }
  .pay-form { grid-template-columns: 1fr; gap: 20px; }
}
@media (max-width: 600px) {
  .cart-line { gap: 14px; padding: 20px 0; }
  .cart-line__img { width: 90px; height: 110px; }
  .cart-line__title { font-size: 18px; }
  .addr-field { flex-direction: column; align-items: stretch; gap: 4px; }
  .addr-field label { flex-basis: auto; }
  .pay-field { flex-direction: column; align-items: stretch; gap: 4px; }
  .pay-field label { flex-basis: auto; }
  .promo__tooltip { left: 0; }
}
</style>
