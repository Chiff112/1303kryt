import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Хранилище корзины: товары, избранное, промокод и все суммы.
// Один общий стор на весь сайт — шапка, попап, страница корзины и
// карточки товаров всегда показывают одинаковые данные.
export const useCartStore = defineStore('cart', () => {
  // Товары в корзине. У каждого: id, title, volume, price, image, ingredients, bonus, qty.
  const items = ref([])
  const isOpen = ref(false) // открыт ли всплывающий попап корзины

  // Ищем товар в корзине по id и объёму.
  const find = (id, volume) =>
    items.value.find((i) => i.id === id && (volume === undefined || i.volume === volume))

  // Добавить товар: если уже есть — увеличиваем количество, иначе кладём новый.
  function add(product) {
    const existing = find(product.id, product.volume)
    if (existing) existing.qty += 1
    else items.value.push({ ...product, qty: 1 })
  }
  function remove(id, volume) {
    items.value = items.value.filter((i) => !(i.id === id && (volume === undefined || i.volume === volume)))
  }
  function increment(id, volume) {
    const it = find(id, volume)
    if (it) it.qty += 1
  }
  function decrement(id, volume) {
    const it = find(id, volume)
    if (!it) return
    it.qty -= 1
    if (it.qty <= 0) remove(id, volume) // дошли до нуля — убираем из корзины
  }
  function clear() { items.value = [] }

  function open()  { isOpen.value = true }
  function close() { isOpen.value = false }

  // Избранное — просто список id товаров.
  const favorites = ref([])
  function toggleFavorite(id) {
    const i = favorites.value.indexOf(id)
    if (i === -1) favorites.value.push(id)
    else favorites.value.splice(i, 1)
  }
  const isFavorite = (id) => favorites.value.includes(id)

  // Промокод: скидка 15% при заказе от 1500 ₽.
  const promoApplied = ref(false)
  const PROMO_MIN = 1500
  const PROMO_RATE = 0.15

  // Применяем промокод. Возвращаем { ok, message } — успех и текст подсказки.
  function applyPromo(code) {
    if (!(code || '').trim()) return { ok: false, message: 'Введите промокод' }
    if (subtotal.value < PROMO_MIN) return { ok: false, message: `Промокод действует от ${PROMO_MIN} ₽` }
    if (promoApplied.value) return { ok: false, message: 'Промокод уже применён' }
    promoApplied.value = true
    return { ok: true, message: 'Промокод применён: −15%' }
  }

  // Суммы, которые сами пересчитываются при изменении корзины.
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const discount = computed(() => (promoApplied.value ? Math.round(subtotal.value * PROMO_RATE) : 0))
  const totalPrice = computed(() => subtotal.value - discount.value)
  const totalBonus = computed(() => items.value.reduce((s, i) => s + (i.bonus || 0) * i.qty, 0))

  // Доставка бесплатна от 1000 ₽, иначе 90 ₽.
  const delivery = computed(() => {
    if (items.value.length === 0) return 0
    return totalPrice.value >= 1000 ? 0 : 90
  })
  const grandTotal = computed(() => totalPrice.value + delivery.value)
  const isEmpty = computed(() => items.value.length === 0)

  return {
    items, isOpen,
    count, discount, totalPrice, totalBonus, delivery, grandTotal, isEmpty,
    add, remove, increment, decrement, clear, open, close,
    toggleFavorite, isFavorite, applyPromo
  }
})
