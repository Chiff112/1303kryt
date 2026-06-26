<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'

// Главный баннер-слайдер вверху страницы (акции).
// Слайды берутся из content.json, листаются стрелками и точками.

const AUTOPLAY_MS = 6000

const { data } = storeToRefs(useContentStore())
const slides = computed(() => data.value?.heroSlides ?? [])

const currentIndex = ref(0)
const sliderEl = ref(null)
const isHovered = ref(false)

let autoplayTimer = null
function startAutoplay() {
  stopAutoplay()
  if (slides.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    if (!isHovered.value && !document.hidden) next()
  }, AUTOPLAY_MS)
}
function stopAutoplay() {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null }
}

function go(idx) {
  const n = slides.value.length
  if (!n) return
  currentIndex.value = ((idx % n) + n) % n
}
function next() { go(currentIndex.value + 1) }
function prev() { go(currentIndex.value - 1) }

// Свайп пальцем
let touchStartX = 0
function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) (dx < 0 ? next() : prev())
}

onMounted(() => {
  // ждём загрузки слайдов и запускаем автопрокрутку
  if (slides.value.length) startAutoplay()
})
watch(slides, (v) => { if (v.length) startAutoplay() })
onBeforeUnmount(stopAutoplay)
</script>

<template>
  <section
    ref="sliderEl"
    class="hero"
    aria-roledescription="carousel"
    aria-label="Промо-акции"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Лента со всеми слайдами; сдвигаем её при смене номера -->
    <div
      class="hero__track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <article
        v-for="(slide, i) in slides"
        :key="slide.id"
        class="hero__slide"
        :style="{ backgroundImage: `url(${slide.background})` }"
        :aria-hidden="i !== currentIndex"
      >
        <div class="hero__inner container">
          <h1 class="hero__title">
            <span
              v-for="(line, li) in slide.title.split('\n')"
              :key="li"
              class="hero__title-line"
            >{{ line }}</span>
          </h1>

          <div class="hero__tag" aria-label="Цена">
            <span class="hero__tag-weight">{{ slide.weight }}</span>
            <span class="hero__tag-price">{{ slide.price }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- Стрелки -->
    <button
      class="hero__arrow hero__arrow--prev"
      type="button"
      aria-label="Предыдущий слайд"
      @click="prev"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button
      class="hero__arrow hero__arrow--next"
      type="button"
      aria-label="Следующий слайд"
      @click="next"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Точки-переключатели -->
    <div class="hero__dots" role="tablist" aria-label="Слайды">
      <button
        v-for="(slide, i) in slides"
        :key="slide.id"
        :class="['hero__dot', { 'is-active': i === currentIndex }]"
        type="button"
        role="tab"
        :aria-selected="i === currentIndex"
        :aria-label="`Слайд ${i + 1} из ${slides.length}`"
        @click="go(i)"
      />
    </div>
  </section>
</template>

<style scoped>
/* Раскладка */
.hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #ddd; /* запасной фон, пока грузится картинка */
}
.hero__track {
  display: flex;
  width: 100%;
  transition: transform 0.55s cubic-bezier(0.6, 0.05, 0.3, 1);
  will-change: transform;
}
.hero__slide {
  flex: 0 0 100%;
  min-width: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* Высота подстраивается под экран, максимум 560px */
  min-height: clamp(280px, 38vw, 560px);
}
.hero__inner {
  position: relative;
  height: 100%;
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 40px;
  padding-bottom: 80px; /* оставляем место для точек */
}

/* Заголовок (рукописный шрифт) */
.hero__title {
  font-family: var(--font-script);
  font-weight: 700;
  color: #fff;
  line-height: 0.85;
  letter-spacing: 1px;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
  font-size: clamp(56px, 9vw, 140px);
  max-width: 60%;
}
.hero__title-line {
  display: block;
}

/* Ценник (белый круг справа) */
.hero__tag {
  position: relative;
  flex: 0 0 auto;
  width: clamp(160px, 22vw, 260px);
  aspect-ratio: 1 / 1;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  color: #1a1a1a;
}
.hero__tag-weight {
  position: absolute;
  top: 18%;
  font-size: clamp(14px, 1.6vw, 20px);
  font-weight: 600;
}
.hero__tag-price {
  font-size: clamp(40px, 6vw, 76px);
  font-weight: 900;
  letter-spacing: -1px;
}

/* Стрелки */
.hero__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background var(--t-fast), transform var(--t-fast);
}
.hero__arrow:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.06);
}
.hero__arrow--prev { left: 16px; }
.hero__arrow--next { right: 16px; }

/* Точки-переключатели */
.hero__dots {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}
.hero__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  transition: background var(--t-fast), transform var(--t-fast);
}
.hero__dot:hover { background: #fff; }
.hero__dot.is-active {
  background: var(--color-green);
  transform: scale(1.15);
}

/* Правки под телефоны и планшеты */
@media (max-width: 767px) {
  .hero__inner {
    padding-top: 24px;
    padding-bottom: 70px;
    gap: 12px;
  }
  .hero__title { max-width: 55%; }
  .hero__arrow { display: none; }
}
@media (max-width: 480px) {
  .hero__tag {
    width: clamp(120px, 36vw, 160px);
  }
}
</style>
