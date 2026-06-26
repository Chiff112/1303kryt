<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import SectionTitle from '../ui/SectionTitle.vue'
import ProductCard from '../ui/ProductCard.vue'

/**
 * BestSellersSection — "Хиты продаж".
 *
 * Card slider: 3 cards visible on desktop, 2 on tablet, 1 on mobile.
 * Arrows on the left and right of the section navigate one card at a
 * time; touch swipe works on mobile.
 *
 * Top and bottom dashed lines match the Figma design.
 *
 * All products come from /data/content.json (`bestSellers`).
 */

const { data } = storeToRefs(useContentStore())
const products = computed(() => data.value?.bestSellers ?? [])

const currentIndex = ref(0)
const visibleCount = ref(3)
const trackEl = ref(null)

function updateVisibleCount() {
  const w = window.innerWidth
  if      (w >= 1024) visibleCount.value = 3
  else if (w >= 640)  visibleCount.value = 2
  else                visibleCount.value = 1
}

const maxIndex = computed(() =>
  Math.max(0, products.value.length - visibleCount.value)
)

function go(idx) {
  currentIndex.value = Math.max(0, Math.min(idx, maxIndex.value))
}
function next() { go(currentIndex.value + 1) }
function prev() { go(currentIndex.value - 1) }

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * (100 / visibleCount.value)}%)`
}))
const cardStyle = computed(() => ({
  flex: `0 0 ${100 / visibleCount.value}%`
}))

// Touch swipe
let touchStartX = 0
function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) (dx < 0 ? next() : prev())
}

onMounted(() => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVisibleCount)
})
</script>

<template>
  <section class="best-sellers" id="best-sellers">
    <div class="container">
      <SectionTitle>Хиты продаж</SectionTitle>

      <div class="best-sellers__shell">
        <button
          class="best-sellers__arrow best-sellers__arrow--prev"
          type="button"
          :disabled="currentIndex === 0"
          aria-label="Предыдущий товар"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div
          class="best-sellers__viewport"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <div ref="trackEl" class="best-sellers__track" :style="trackStyle">
            <div
              v-for="product in products"
              :key="product.id"
              class="best-sellers__cell"
              :style="cardStyle"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>

        <button
          class="best-sellers__arrow best-sellers__arrow--next"
          type="button"
          :disabled="currentIndex >= maxIndex"
          aria-label="Следующий товар"
          @click="next"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.best-sellers {
  background: #fff;
  padding: 56px 0;
}

.best-sellers__shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.best-sellers__viewport {
  flex: 1 1 auto;
  overflow: hidden;
}
.best-sellers__track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.6, 0.05, 0.3, 1);
  will-change: transform;
}
.best-sellers__cell { min-width: 0; }

/* ----- Arrows ----- */
.best-sellers__arrow {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color var(--t-fast), background var(--t-fast);
}
.best-sellers__arrow:hover:not(:disabled) {
  color: var(--color-text);
  background: rgba(0, 0, 0, 0.05);
}
.best-sellers__arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .best-sellers       { padding: 40px 0; }
  .best-sellers__shell { gap: 4px; }
}
</style>
