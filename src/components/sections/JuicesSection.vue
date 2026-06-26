<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import JuiceCard from '../ui/JuiceCard.vue'
import ProductDetailModal from '../ui/ProductDetailModal.vue'

/**
 * JuicesSection — the "СОКИ" category page.
 *
 * Green title band ("СОКИ") followed by a responsive product grid.
 * Clicking any card opens a ProductDetailModal showing the full
 * composition (ingredients, nutrition, storage, etc.).
 *
 * Products come from /data/content.json (`juices`).
 */

const { data } = storeToRefs(useContentStore())
const juices = computed(() => data.value?.juices ?? [])

const detailProduct = ref(null)
function openDetail(product) { detailProduct.value = product }
function closeDetail()       { detailProduct.value = null }
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
          @open-detail="openDetail"
        />
      </div>
    </div>

    <!-- Product detail modal -->
    <ProductDetailModal
      v-if="detailProduct"
      :product="detailProduct"
      @close="closeDetail"
    />
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
