<script setup>
import { useCartStore } from '../../stores/cart.js'

/**
 * HeartButton — wishlist toggle.
 * Click to add/remove from favorites; fills red when active.
 * Backed by the shared cart store, so the same product shows the same
 * state on its card and in its detail modal.
 */
const props = defineProps({
  productId: { type: [String, Number], required: true },
  size:      { type: Number, default: 24 }
})

const cart = useCartStore()

function toggle() {
  cart.toggleFavorite(props.productId)
}
</script>

<template>
  <button
    class="heart"
    :class="{ 'is-active': cart.isFavorite(productId) }"
    type="button"
    :aria-pressed="cart.isFavorite(productId)"
    aria-label="В избранное"
    @click.stop="toggle"
  >
    <svg
      :width="size" :height="size"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 21s-7.5-4.6-10-9.3C.6 8.9 1.9 5.5 5.2 5.1 7.3 4.8 9 6 12 8.5c3-2.5 4.7-3.7 6.8-3.4 3.3.4 4.6 3.8 3.2 6.6C19.5 16.4 12 21 12 21z"
        :fill="cart.isFavorite(productId) ? '#E4087E' : 'none'"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.heart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  transition: transform var(--t-fast), color var(--t-fast);
}
.heart:hover { transform: scale(1.15); }
.heart.is-active { color: #E4087E; }
</style>
