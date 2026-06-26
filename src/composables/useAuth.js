import { ref, reactive, computed } from 'vue'
import { useCart } from './useCart.js'

/**
 * useAuth — shared authentication + account "store".
 *
 * Like useCart, the state lives at module scope so every component
 * (header, login modal, account page) reads and writes the SAME data.
 *
 * Demo account (for the personal-area walkthrough):
 *   login : Chiff
 *   phone : 79138841508   (entered as +7…, spaces/() are ignored)
 *   code  : 77777
 *
 * Order history and the starting bonus balance are loaded from
 * /data/content.json (the `account` section) via fetch().
 */

// ---------- Demo credentials ----------
const DEMO = {
  login: 'Chiff',
  phone: '79138841508',
  code: '77777',
  // Pre-filled profile shown after login (editable on the account page)
  profile: {
    name: 'Chiff',
    phone: '+79138841508',
    birthday: '28.05.1995',
    email: 'chiff@mail.com'
  }
}

// Keep only digits so "+7 (913) 884-15-08" === "79138841508"
function normalizePhone(value) {
  return (value || '').replace(/\D/g, '')
}

// ---------- State ----------
const isLoggedIn = ref(false)
const user = reactive({ name: '', phone: '', birthday: '', email: '' })
const balance = ref(0)
const orders = ref([])
let loaded = false

/** Load balance + order history from content.json (once). */
async function loadAccount() {
  if (loaded) return
  loaded = true
  try {
    const res = await fetch('/data/content.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    balance.value = json.account?.balance ?? 0
    orders.value = json.account?.orders ?? []
  } catch (err) {
    console.error('Failed to load account data:', err)
  }
}

/**
 * Attempt a login. Returns { ok, message }.
 * Validates the entered phone + sms code against the demo account.
 */
function login(phone, code) {
  if (normalizePhone(phone) !== DEMO.phone) {
    return { ok: false, message: 'Неверный номер телефона' }
  }
  if ((code || '').trim() !== DEMO.code) {
    return { ok: false, message: 'Неверный код из sms' }
  }
  Object.assign(user, DEMO.profile)
  isLoggedIn.value = true
  loadAccount()
  return { ok: true, message: 'Вы вошли' }
}

function logout() {
  isLoggedIn.value = false
  Object.assign(user, { name: '', phone: '', birthday: '', email: '' })
}

/** Save edited profile fields. */
function updateProfile(profile) {
  Object.assign(user, profile)
}

/** Re-order: push every item of a past order back into the cart. */
function repeatOrder(order) {
  const cart = useCart()
  order.items.forEach((item) => cart.add({ ...item }))
}

const displayName = computed(() => (isLoggedIn.value ? user.name || DEMO.login : null))

export function useAuth() {
  return {
    isLoggedIn,
    user,
    balance,
    orders,
    displayName,
    login,
    logout,
    updateProfile,
    repeatOrder,
    loadAccount
  }
}
