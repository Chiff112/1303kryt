import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useCartStore } from './cart.js'

// Хранилище входа и личного кабинета.
// Демо-аккаунт для проверки кабинета:
//   логин: Chiff, телефон: 79138841508, код из sms: 77777
// Баланс бонусов и история заказов берутся из content.json при входе.

const DEMO = {
  phone: '79138841508',
  code: '77777',
  // Данные профиля, которые подставятся после входа.
  profile: { name: 'Chiff', phone: '+79138841508', birthday: '28.05.1995', email: 'chiff@mail.com' }
}

// Оставляем только цифры, чтобы "+7 (913) 884-15-08" === "79138841508".
const onlyDigits = (value) => (value || '').replace(/\D/g, '')

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const user = reactive({ name: '', phone: '', birthday: '', email: '' })
  const balance = ref(0)
  const orders = ref([])
  let loaded = false

  // Загружаем баланс и историю заказов из content.json (один раз).
  async function loadAccount() {
    if (loaded) return
    loaded = true
    try {
      const json = await (await fetch('/data/content.json')).json()
      balance.value = json.account?.balance ?? 0
      orders.value = json.account?.orders ?? []
    } catch (err) {
      console.error('Не удалось загрузить данные кабинета:', err)
    }
  }

  // Проверяем телефон и код. Возвращаем { ok, message }.
  function login(phone, code) {
    if (onlyDigits(phone) !== DEMO.phone) return { ok: false, message: 'Неверный номер телефона' }
    if ((code || '').trim() !== DEMO.code) return { ok: false, message: 'Неверный код из sms' }
    Object.assign(user, DEMO.profile)
    isLoggedIn.value = true
    loadAccount()
    return { ok: true, message: 'Вы вошли' }
  }

  function logout() {
    isLoggedIn.value = false
    Object.assign(user, { name: '', phone: '', birthday: '', email: '' })
  }

  // Сохранить изменённые поля профиля.
  const updateProfile = (profile) => Object.assign(user, profile)

  // Повторить заказ — добавить все его товары обратно в корзину.
  function repeatOrder(order) {
    const cart = useCartStore()
    order.items.forEach((item) => cart.add({ ...item }))
  }

  // Имя для шапки: если вошли — имя, иначе null (показываем «Войти»).
  const displayName = computed(() => (isLoggedIn.value ? user.name || 'Chiff' : null))

  return { isLoggedIn, user, balance, orders, displayName, login, logout, updateProfile, repeatOrder, loadAccount }
})
