<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '../../stores/auth.js'

// Окно входа. Шаг 1 — имя и телефон, шаг 2 — код из sms.
// Проверяет данные через стор авторизации и показывает ошибки.

const emit = defineEmits(['close', 'success'])

const auth = useAuthStore()

const name  = ref('')
const phone = ref('')
const code  = ref('')

const codeSent = ref(false)   // false = phase 1, true = phase 2
const triedSubmit = ref(false)
const authError = ref('')     // ошибка от стора (неверный телефон или код)

const nameError  = computed(() => triedSubmit.value && !name.value.trim())
const phoneError = computed(() => triedSubmit.value && !phone.value.trim())
const codeError  = computed(() => triedSubmit.value && codeSent.value && !code.value.trim())

function sendCode() {
  triedSubmit.value = true
  if (!name.value.trim() || !phone.value.trim()) return
  codeSent.value = true
  triedSubmit.value = false
  authError.value = ''
}

function submit() {
  triedSubmit.value = true
  if (!code.value.trim()) return
  const res = auth.login(phone.value, code.value)
  if (!res.ok) {
    authError.value = res.message
    return
  }
  emit('success')
  emit('close')
}

function close() { emit('close') }
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="login-modal" role="dialog" aria-modal="true" aria-label="Вход на сайт">
      <!-- Шапка -->
      <div class="login-modal__header">
        <h2 class="login-modal__title">Вход на сайт</h2>
        <button class="login-modal__close" type="button" aria-label="Закрыть" @click="close">×</button>
      </div>

      <!-- Содержимое -->
      <div class="login-modal__body">
        <!-- Имя -->
        <div class="login-field">
          <label class="login-field__label" for="login-name">Имя</label>
          <div class="login-field__control">
            <input
              id="login-name"
              v-model="name"
              type="text"
              class="login-field__input"
              :class="{ 'is-error': nameError }"
              autocomplete="name"
            />
            <span v-if="nameError" class="login-field__error">Пожалуйста введите имя</span>
          </div>
        </div>

        <!-- Телефон -->
        <div class="login-field">
          <label class="login-field__label" for="login-phone">Телефон</label>
          <div class="login-field__control">
            <input
              id="login-phone"
              v-model="phone"
              type="tel"
              class="login-field__input"
              :class="{ 'is-error': phoneError }"
              autocomplete="tel"
            />
            <span v-if="phoneError" class="login-field__error">Пожалуйста введите телефон</span>
          </div>
        </div>

        <!-- Шаг 1: выслать код -->
        <template v-if="!codeSent">
          <div class="login-field login-field--action">
            <span class="login-field__label">Выслать код</span>
            <p class="login-modal__agreement">
              Продолжая Вы соглашаетесь с пользовательским соглашением и политикой
              обработки персональных данных
            </p>
          </div>
          <button class="login-modal__send" type="button" aria-label="Выслать код" @click="sendCode">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M5 12l14-7-7 14-2-5-5-2z" fill="currentColor" />
            </svg>
          </button>
        </template>

        <!-- Шаг 2: ввести код -->
        <template v-else>
          <div class="login-field">
            <label class="login-field__label" for="login-code">Введите код</label>
            <div class="login-field__control">
              <input
                id="login-code"
                v-model="code"
                type="text"
                class="login-field__input"
                :class="{ 'is-error': codeError }"
              />
              <span v-if="codeError" class="login-field__error">Пожалуйста введите код из sms</span>
            </div>
          </div>
          <p v-if="authError" class="login-modal__auth-error">{{ authError }}</p>
          <div class="login-modal__submit">
            <BaseButton variant="primary" size="md" @click="submit">Войти</BaseButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(130, 130, 130, 0.55);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-modal {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

/* Шапка */
.login-modal__header {
  background: var(--color-yellow);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-modal__title {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 0;
}
.login-modal__close {
  font-size: 26px;
  line-height: 1;
  color: var(--color-text);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Содержимое */
.login-modal__body {
  padding: 24px;
  position: relative;
}

.login-field {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 22px;
}
.login-field__label {
  flex: 0 0 110px;
  font-size: 20px;
  font-weight: 400;
  color: var(--color-text);
}
.login-field__control { flex: 1 1 auto; min-width: 0; }

.login-field__input {
  width: 100%;
  border: none;
  border-bottom: 3px dashed var(--color-text);
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  color: var(--color-text);
  padding: 2px 0 6px;
  outline: none;
}
.login-field__input:focus { border-bottom-color: var(--color-green); }
.login-field__input.is-error { border-bottom-color: var(--color-red); }

.login-field__error {
  display: block;
  color: var(--color-red);
  font-size: 14px;
  font-weight: 600;
  margin-top: -2px;
}

/* «Выслать код» и текст согласия */
.login-field--action { align-items: flex-start; }
.login-modal__agreement {
  flex: 1 1 auto;
  font-size: 11px;
  line-height: 1.4;
  color: var(--color-text-muted);
  margin: 0;
}

/* Кнопка-самолётик «отправить» */
.login-modal__send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 36px;
  margin: 0 auto;
  border-radius: var(--radius-pill);
  background: var(--color-yellow);
  color: var(--color-text);
  box-shadow: 0 3px 0 var(--color-yellow-dark);
  transition: background var(--t-fast);
}
.login-modal__send:hover { background: #FFC638; }

/* Кнопка входа */
.login-modal__submit {
  display: flex;
  justify-content: flex-end;
}
.login-modal__auth-error {
  color: var(--color-red);
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
}

@media (max-width: 480px) {
  .login-field { flex-direction: column; gap: 6px; align-items: stretch; }
  .login-field__label { flex-basis: auto; font-size: 18px; }
}
</style>
