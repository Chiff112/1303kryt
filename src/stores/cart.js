import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Cart store (Pinia) — cart items, favorites, promo code and all the
 * derived totals. Shared across the header, popup, cart page, product
 * cards and footer, so every place stays in sync.
 */
export const useCartStore = defineStore('cart', () => {
  // ---------- Cart items ----------
  // Each item: { id, title, volume, price, image, ingredients, bonus, qty }
  const items = ref([])
  const isOpen = ref(false) // slide-in popup visibility

  function add(product) {
    const existing = items.value.find((i) => i.id === product.id && i.volume === product.volume)
    if (existing) {
      existing.qty += 1
    } else {
      items.value.push({ ...product, qty: 1 })
    }
  }
  function remove(id, volume) {
    items.value = items.value.filter((i) => !(i.id === id && (volume === undefined || i.volume === volume)))
  }
  function increment(id, volume) {
    const it = items.value.find((i) => i.id === id && (volume === undefined || i.volume === volume))
    if (it) it.qty += 1
  }
  function decrement(id, volume) {
    const it = items.value.find((i) => i.id === id && (volume === undefined || i.volume === volume))
    if (!it) return
    it.qty -= 1
    if (it.qty <= 0) remove(id, volume)
  }
  function clear() { items.value = [] }

  function open()   { isOpen.value = true }
  function close()  { isOpen.value = false }
  function toggle() { isOpen.value = !isOpen.value }

  // ---------- Favorites ----------
  const favorites = ref([]) // array of product ids
  function toggleFavorite(id) {
    const i = favorites.value.indexOf(id)
    if (i === -1) favorites.value.push(id)
    else favorites.value.splice(i, 1)
  }
  function isFavorite(id) {
    return favorites.value.includes(id)
  }

  // ---------- Promo code ----------
  const promoApplied = ref(false)
  const PROMO_MIN = 1500
  const PROMO_RATE = 0.15

  /** Apply a promo code. Returns { ok, message }. */
  function applyPromo(code) {
    const trimmed = (code || '').trim()
    if (!trimmed) {
      return { ok: false, message: 'Введите промокод' }
    }
    if (subtotal.value < PROMO_MIN) {
      return { ok: false, message: `Промокод действует от ${PROMO_MIN} ₽` }
    }
    if (promoApplied.value) {
      return { ok: false, message: 'Промокод уже применён' }
    }
    promoApplied.value = true
    return { ok: true, message: 'Промокод применён: −15%' }
  }
  function resetPromo() { promoApplied.value = false }

  // ---------- Derived totals ----------
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))

  const subtotal = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.qty, 0)
  )
  const discount = computed(() =>
    promoApplied.value ? Math.round(subtotal.value * PROMO_RATE) : 0
  )
  const totalPrice = computed(() => subtotal.value - discount.value)

  const totalBonus = computed(() =>
    items.value.reduce((s, i) => s + (i.bonus || 0) * i.qty, 0)
  )

  const DELIVERY_FEE = 90
  const FREE_FROM = 1000
  const delivery = computed(() => {
    if (items.value.length === 0) return 0
    return totalPrice.value >= FREE_FROM ? 0 : DELIVERY_FEE
  })

  const grandTotal = computed(() => totalPrice.value + delivery.value)
  const isEmpty = computed(() => items.value.length === 0)

  return {
    items, isOpen, favorites, promoApplied,
    count, subtotal, discount, totalPrice, totalBonus, delivery, grandTotal, isEmpty,
    add, remove, increment, decrement, clear,
    open, close, toggle,
    toggleFavorite, isFavorite,
    applyPromo, resetPromo
  }
})
