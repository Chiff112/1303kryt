import { ref, computed } from 'vue'

/**
 * useCart — a tiny shared cart "store" built on Vue reactivity.
 *
 * State lives at module scope, so every component that calls useCart()
 * reads and writes the SAME cart (header summary, popup, product cards,
 * footer summary all stay in sync).
 *
 * A free "Бутылочка" (bottle) gift line is always shown at 0 ₽, mirroring
 * the design.
 */

// Each item: { id, title, volume, price, image, ingredients, bonus, qty }
const items = ref([])
const isOpen = ref(false)   // cart popup visibility

function add(product) {
  const existing = items.value.find((i) => i.id === product.id)
  if (existing) {
    existing.qty += 1
  } else {
    items.value.push({ ...product, qty: 1 })
  }
}

function remove(id) {
  items.value = items.value.filter((i) => i.id !== id)
}

function increment(id) {
  const it = items.value.find((i) => i.id === id)
  if (it) it.qty += 1
}

function decrement(id) {
  const it = items.value.find((i) => i.id === id)
  if (!it) return
  it.qty -= 1
  if (it.qty <= 0) remove(id)
}

function clear() {
  items.value = []
}

function open()   { isOpen.value = true }
function close()  { isOpen.value = false }
function toggle() { isOpen.value = !isOpen.value }

// ----- Derived totals -----
const count = computed(() =>
  items.value.reduce((sum, i) => sum + i.qty, 0)
)
const totalPrice = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
)
const totalBonus = computed(() =>
  items.value.reduce((sum, i) => sum + (i.bonus || 0) * i.qty, 0)
)
const isEmpty = computed(() => items.value.length === 0)

export function useCart() {
  return {
    items,
    isOpen,
    count,
    totalPrice,
    totalBonus,
    isEmpty,
    add,
    remove,
    increment,
    decrement,
    clear,
    open,
    close,
    toggle
  }
}
