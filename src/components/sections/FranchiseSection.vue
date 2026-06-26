<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import BaseButton from '../ui/BaseButton.vue'

/**
 * FranchiseSection — «Наша франшиза» page.
 *
 * A centered green title band over a two-column block: the fruit hero
 * image on the left, the pitch text + «Подробнее» CTA on the right.
 * All copy and the image path come from `franchise` in content.json.
 */

const { data } = useContent()
const franchise = computed(() => data.value?.franchise ?? null)
</script>

<template>
  <section v-if="franchise" class="franchise">
    <!-- Title band -->
    <div class="franchise__band">
      <h1 class="franchise__title container">{{ franchise.title }}</h1>
    </div>

    <!-- Content -->
    <div class="container franchise__content">
      <div class="franchise__media">
        <img :src="franchise.image" alt="Свежие фрукты и соки Vita Juice" />
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

/* ---------- Title band ---------- */
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

/* ---------- Content ---------- */
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

/* ---------- Responsive ---------- */
@media (max-width: 820px) {
  .franchise__content {
    grid-template-columns: 1fr;
    gap: 28px;
    padding-top: 28px;
  }
  .franchise__media { max-width: 560px; margin: 0 auto; }
}
</style>
