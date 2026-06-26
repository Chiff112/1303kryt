<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import JuiceCard from '../ui/JuiceCard.vue'

/**
 * JuicesSection — the "СОКИ" category page.
 *
 * Green title band ("СОКИ") followed by a responsive product grid
 * (4 columns on desktop, 3 / 2 / 1 as the screen narrows).
 *
 * Products come from /data/content.json (`juices`).
 */

const { data } = useContent()
const juices = computed(() => data.value?.juices ?? [])
</script>

<template>
  <section class="juices" id="juices-page">
    <!-- Green title band -->
    <div class="juices__band">
      <h1 class="juices__title">Соки</h1>
    </div>

    <!-- Product grid -->
    <div class="container">
      <div class="juices__grid">
        <JuiceCard
          v-for="product in juices"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.juices {
  background: #fff;
  padding-bottom: 56px;
}

/* Green title band */
.juices__band {
  background: var(--color-green);
  padding: 28px 20px;
  text-align: center;
  margin-bottom: 40px;
}
.juices__title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  margin: 0;
}

/* Grid */
.juices__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1023px) {
  .juices__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 720px) {
  .juices__grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (max-width: 460px) {
  .juices__grid { grid-template-columns: 1fr; }
}
</style>
