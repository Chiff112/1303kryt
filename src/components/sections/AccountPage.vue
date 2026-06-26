<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuth } from '../../composables/useAuth.js'
import BaseButton from '../ui/BaseButton.vue'

/**
 * AccountPage — the personal area, reached from the header once logged
 * in. A green band hosts two tabs plus the live bonus balance:
 *
 *   ЛИЧНЫЙ КАБИНЕТ | ИСТОРИЯ ЗАКАЗОВ            БАЛАНС {N}
 *
 *   • profile  — editable Имя / Телефон / Дата рождения / E-mail with
 *                inline validation and a birthday-gift tooltip.
 *   • history  — past orders (date · total · expandable «состав» ·
 *                «повторить»), loaded from content.json via useAuth.
 *
 * «Сохранить» saves the profile, «Выйти» logs out (emits `home`).
 * «Повторить» drops an order's items back into the cart (emits `cart`).
 */

const auth = useAuth()
const emit = defineEmits(['home', 'cart'])

// make sure orders/balance are loaded (also triggered on login)
auth.loadAccount()

const tab = ref('profile') // 'profile' | 'history'
function goTab(t) {
  tab.value = t
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------------- Profile form ---------------- */
const form = reactive({
  name: auth.user.name,
  phone: auth.user.phone,
  birthday: auth.user.birthday,
  email: auth.user.email
})
const tried = ref(false)
const saved = ref(false)
const showBirthdayHint = ref(false)

const errors = computed(() => ({
  name:     tried.value && !form.name.trim(),
  phone:    tried.value && !form.phone.trim(),
  birthday: tried.value && !form.birthday.trim(),
  email:    tried.value && !form.email.trim()
}))

function save() {
  tried.value = true
  saved.value = false
  if (Object.values(errors.value).some(Boolean)) return
  auth.updateProfile({ ...form })
  saved.value = true
}

function logout() {
  auth.logout()
  emit('home')
}

/* ---------------- Order history ---------------- */
const openOrder = ref(null) // index of the expanded order, or null
function toggleOrder(i) {
  openOrder.value = openOrder.value === i ? null : i
}
function repeat(order) {
  auth.repeatOrder(order)
  emit('cart')
}
</script>

<template>
  <section class="account">
    <!-- Band with tabs + balance -->
    <div class="account-band">
      <div class="account-band__inner container">
        <button
          class="account-band__tab"
          :class="{ 'is-active': tab === 'profile' }"
          type="button"
          @click="goTab('profile')"
        >Личный кабинет</button>
        <button
          class="account-band__tab"
          :class="{ 'is-active': tab === 'history' }"
          type="button"
          @click="goTab('history')"
        >История заказов</button>
        <span class="account-band__balance">Баланс {{ auth.balance.value }}</span>
      </div>
    </div>

    <div class="container account__body">
      <!-- ================= PROFILE ================= -->
      <template v-if="tab === 'profile'">
        <div class="profile">
          <div class="profile__form">
            <!-- Имя -->
            <div class="profile-field">
              <label class="profile-field__label">Имя</label>
              <div class="profile-field__control">
                <span v-if="errors.name" class="profile-field__error">Пожалуйста введите имя</span>
                <input v-model="form.name" class="profile-field__input" :class="{ 'is-error': errors.name }" />
              </div>
            </div>

            <!-- Телефон -->
            <div class="profile-field">
              <label class="profile-field__label">Телефон</label>
              <div class="profile-field__control">
                <span v-if="errors.phone" class="profile-field__error">Пожалуйста введите телефон</span>
                <input v-model="form.phone" class="profile-field__input" :class="{ 'is-error': errors.phone }" />
              </div>
            </div>

            <!-- Дата рождения (+ info tooltip) -->
            <div class="profile-field">
              <label class="profile-field__label">Дата рождения</label>
              <div class="profile-field__control">
                <span v-if="errors.birthday" class="profile-field__error">Пожалуйста введите дату рождения</span>
                <input v-model="form.birthday" class="profile-field__input" :class="{ 'is-error': errors.birthday }" placeholder="дд.мм.гггг" />
              </div>
              <button
                class="profile-field__info"
                type="button"
                aria-label="О дате рождения"
                @mouseenter="showBirthdayHint = true"
                @mouseleave="showBirthdayHint = false"
                @click="showBirthdayHint = !showBirthdayHint"
              >i</button>
            </div>

            <!-- E-mail -->
            <div class="profile-field">
              <label class="profile-field__label">E-mail</label>
              <div class="profile-field__control">
                <span v-if="errors.email" class="profile-field__error">Пожалуйста введите E-mail</span>
                <input v-model="form.email" class="profile-field__input" :class="{ 'is-error': errors.email }" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="profile__actions">
              <BaseButton variant="primary" size="md" @click="save">Сохранить</BaseButton>
              <BaseButton variant="primary" size="md" @click="logout">Выйти</BaseButton>
            </div>
            <p v-if="saved" class="profile__saved">Изменения сохранены</p>
          </div>

          <!-- Birthday-gift speech bubble -->
          <div v-if="showBirthdayHint" class="profile__bubble">
            <span>Дарим подарок<br />на ДР!</span>
          </div>
        </div>
      </template>

      <!-- ================= HISTORY ================= -->
      <template v-else>
        <ul class="orders">
          <li v-for="(order, i) in auth.orders.value" :key="order.date" class="order">
            <div class="order__row">
              <span class="order__date">{{ order.date }}</span>
              <span class="order__total">{{ order.total }}₽</span>

              <button class="order__compose" type="button" @click="toggleOrder(i)">
                <span>состав</span>
                <img
                  src="/images/triangle.png"
                  alt=""
                  class="order__triangle"
                  :class="{ 'is-open': openOrder === i }"
                />
              </button>

              <button class="order__repeat" type="button" @click="repeat(order)">
                <span>повторить</span>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M20 11a8 8 0 1 0-2.3 5.6" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" />
                  <path d="M20 4v6h-6" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

            <!-- Expanded item breakdown -->
            <transition name="compose">
              <ul v-if="openOrder === i" class="order__items">
                <li v-for="item in order.items" :key="item.id" class="order__item">
                  <span class="order__item-price">{{ item.price }}₽</span>
                  <span class="order__item-title">{{ item.title }}</span>
                </li>
              </ul>
            </transition>
          </li>
        </ul>

        <!-- Same persistent account actions as the profile tab -->
        <div class="profile__actions profile__actions--center">
          <BaseButton variant="primary" size="md" @click="goTab('profile')">Сохранить</BaseButton>
          <BaseButton variant="primary" size="md" @click="logout">Выйти</BaseButton>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.account { background: #fff; }

/* ---------- Band (reuses the green stepper look) ---------- */
.account-band {
  background: var(--color-green);
  margin-bottom: 36px;
}
.account-band__inner {
  display: flex;
  align-items: center;
  gap: clamp(16px, 5vw, 80px);
  padding-top: 18px;
  padding-bottom: 18px;
}
.account-band__tab {
  font-size: clamp(20px, 3.4vw, 40px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.45);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.account-band__tab.is-active { color: #fff; }
.account-band__tab:hover { color: rgba(255, 255, 255, 0.8); }
.account-band__balance {
  margin-left: auto;
  font-size: clamp(20px, 3.4vw, 40px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.account__body { padding-bottom: 48px; }

/* ---------- Profile ---------- */
.profile {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  position: relative;
}
.profile__form { flex: 1 1 auto; max-width: 620px; }

.profile-field {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 18px;
}
.profile-field__label {
  flex: 0 0 auto;
  width: clamp(140px, 17vw, 220px);
  white-space: nowrap;
  font-size: clamp(18px, 2.2vw, 24px);
  color: var(--color-text);
}
.profile-field__control {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 320px;
}
.profile-field__error {
  display: block;
  color: var(--color-red);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}
.profile-field__input {
  width: 100%;
  border: none;
  border-bottom: 4px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  color: var(--color-text);
  padding: 2px 0 8px;
  outline: none;
}
.profile-field__input:focus { border-bottom-color: var(--color-green); }
.profile-field__input.is-error { border-bottom-color: var(--color-red); }
.profile-field__info {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--color-text);
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  align-self: center;
}

.profile__actions {
  display: flex;
  align-items: center;
  gap: clamp(24px, 8vw, 90px);
  margin-top: 30px;
}
.profile__actions--center {
  justify-content: center;
  margin-top: 40px;
}
.profile__saved {
  margin-top: 14px;
  color: var(--color-green);
  font-weight: 600;
}

/* Birthday-gift speech bubble */
.profile__bubble {
  flex: 0 0 auto;
  width: 210px;
  height: 150px;
  margin-top: 70px;
  background: url('/images/cloud-bubble.png') center/contain no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.profile__bubble span {
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  color: var(--color-green);
  font-size: 18px;
  line-height: 1.15;
  transform: rotate(-6deg);
  padding-bottom: 14px;
}

/* ---------- Order history ---------- */
.orders { display: block; }
.order {
  border-bottom: 4px dashed var(--color-text);
  padding: 22px 0;
}
.order:first-child { padding-top: 4px; }
.order__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  gap: 16px;
}
.order__date,
.order__total {
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 800;
}
.order__compose,
.order__repeat {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(16px, 2.2vw, 24px);
  font-weight: 700;
  color: var(--color-text);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.order__compose { justify-self: center; }
.order__repeat  { justify-self: end; }
.order__compose:hover,
.order__repeat:hover { color: var(--color-green); }
.order__triangle {
  width: 22px;
  height: 22px;
  object-fit: contain;
  transition: transform var(--t-base);
}
.order__triangle:not(.is-open) { transform: rotate(180deg); }

.order__items {
  list-style: none;
  margin: 16px 0 0;
  padding: 0 0 0 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.order__item {
  display: flex;
  gap: 60px;
  color: var(--color-text-muted);
  font-size: clamp(15px, 2vw, 22px);
  font-weight: 600;
}
.order__item-price { flex: 0 0 110px; }

/* expand/collapse */
.compose-enter-active, .compose-leave-active { transition: opacity var(--t-base); }
.compose-enter-from, .compose-leave-to { opacity: 0; }

/* ---------- Responsive ---------- */
@media (max-width: 760px) {
  .profile { flex-direction: column; }
  .profile__bubble { margin: 8px 0 0; }
  .profile-field { flex-wrap: wrap; gap: 8px 16px; }
  .profile-field__label { width: 130px; }
  .order__row {
    grid-template-columns: 1fr 1fr;
    gap: 12px 16px;
  }
  .order__compose { justify-self: start; }
  .order__repeat  { justify-self: end; }
}
@media (max-width: 460px) {
  .profile-field { flex-direction: column; align-items: stretch; }
  .profile-field__label { width: auto; white-space: normal; }
  .profile-field__control { max-width: none; }
  .profile-field__info { align-self: flex-start; }
  .profile__actions { gap: 20px; }
  .order__item { gap: 24px; }
}
</style>
