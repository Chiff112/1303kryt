<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import BaseButton from '../ui/BaseButton.vue'

// Секция «Наша франшиза»: заголовок, картинка и текст с кнопкой.
// Пасхалка: вместо картинки — кнопка «тут нет картинки :(((».
// По клику показывается спрятанная картинка.

const { data } = storeToRefs(useContentStore())
const franchise = computed(() => data.value?.franchise ?? null)

// false — показываем кнопку, true — показываем спрятанную картинку.
const showPicture = ref(false)
</script>

<template>
  <section v-if="franchise" class="franchise">
    <!-- Плашка с заголовком -->
    <div class="franchise__band">
      <h1 class="franchise__title container">{{ franchise.title }}</h1>
    </div>

    <!-- Содержимое -->
    <div class="container franchise__content">
      <div class="franchise__media">
        <!-- Пасхалка: сначала кнопка, после клика — картинка -->
        <button
          v-if="!showPicture"
          class="franchise__noimg"
          type="button"
          @click="showPicture = true"
        >тут нет картинки :(((</button>

        <img
          v-else
          src="/images/egg-picture-1.jpg"
          alt="Секретная картинка"
          class="franchise__egg"
          @click="showPicture = false"
        />
      </div>

      <div class="franchise__text">
        <p v-for="(p, i) in franchise.paragraphs" :key="i">{{ p }}</p>
        <BaseButton variant="primary" size="md" class="franchise__cta">
          {{ franchise.cta }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.franchise { background: #fff; }

/* ---------- Плашка с заголовком ---------- */
.franchise__band {
  background: var(--color-green);
}
.franchise__title {
  text-align: center;
  color: #fff;
  font-size: clamp(34px, 6vw, 72px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding-top: 22px;
  padding-bottom: 22px;
}

/* ---------- Содержимое ---------- */
.franchise__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(30px, 5vw, 70px);
  align-items: center;
  padding-top: 40px;
  padding-bottom: 56px;
}
.franchise__media img {
  width: 100%;
  height: auto;
  display: block;
}

/* Кнопка-пасхалка вместо картинки */
.franchise__noimg {
  width: 100%;
  min-height: 280px;
  border: 3px dashed var(--color-text);
  border-radius: var(--radius-md);
  background: #f6f6f6;
  color: var(--color-text);
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 700;
  cursor: pointer;
  transition: background var(--t-fast), transform var(--t-fast);
}
.franchise__noimg:hover { background: #eee; transform: translateY(-2px); }

/* Спрятанная картинка */
.franchise__egg {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.franchise__text {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.franchise__text p {
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  color: var(--color-text);
}
.franchise__cta { align-self: flex-start; margin-top: 6px; }

/* ---------- Адаптив (под телефоны) ---------- */
@media (max-width: 820px) {
  .franchise__content {
    grid-template-columns: 1fr;
    gap: 28px;
    padding-top: 28px;
  }
  .franchise__media { max-width: 560px; margin: 0 auto; }
}
</style>
