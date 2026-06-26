<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import SectionTitle from '../ui/SectionTitle.vue'
import CategoryCircle from '../ui/CategoryCircle.vue'

/**
 * ProductsSection — "Наша продукция".
 *
 * Matches the Figma frame:
 *   - Rounded green panel (`bg-products.png`).
 *   - The girl sits flush against the LEFT edge of the panel, standing
 *     in front of a soft green semicircle backdrop.
 *   - A self-contained speech bubble (cloud + text baked into one PNG)
 *     floats to the right of her head, tilted slightly (< 45°), its
 *     tail pointing left-down toward her mouth.
 *   - 4×2 grid of category circles fills the right side.
 *
 * Categories come from /data/content.json.
 */

const { data } = useContent()
const categories = computed(() => data.value?.categories ?? [])
</script>

<template>
  <section class="products" id="products">
    <div class="container">
      <SectionTitle>Наша продукция</SectionTitle>
    </div>

    <div class="products__panel">
      <div class="products__panel-inner container">
        <!-- Left: girl with smoothie + semicircle backdrop + speech bubble -->
        <div class="products__girl">
          <img
            src="/images/girl-backdrop.png"
            alt=""
            class="products__girl-backdrop"
            aria-hidden="true"
          />
          <img
            src="/images/girl-smoothie.png"
            alt="Девушка пьёт зелёный смузи"
            class="products__girl-img"
          />

          <!-- Complete bubble (cloud + phrase in one image) -->
          <img
            src="/images/bubble-products.png"
            alt="Полезно и питательно!"
            class="products__bubble"
          />
        </div>

        <!-- Right: 4×2 grid of category circles -->
        <div class="products__grid">
          <CategoryCircle
            v-for="cat in categories"
            :key="cat.id"
            :title="cat.title"
            :image="cat.image"
            :href="`#${cat.id}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.products {
  background: #fff;
  padding: 64px 0;
}

.products__panel {
  position: relative;
  background-image: url('/images/bg-products.png');
  background-size: cover;
  background-position: center;
  background-color: var(--color-green); /* fallback */
  overflow: hidden;
}
.products__panel-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.3fr);
  align-items: center;
  gap: 24px;
  min-height: 360px;
}

/* ----- Girl column ----- */
.products__girl {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  min-height: 360px;
}

/* Soft green semicircle backdrop behind the girl */
.products__girl-backdrop {
  position: absolute;
  bottom: 0;
  left: 38%;
  width: 90%;
  max-width: 460px;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  opacity: 0.85;
}

/* Girl photo — flush to the left edge, natural colors */
.products__girl-img {
  position: relative;
  z-index: 2;
  width: auto;
  max-width: 92%;
  max-height: 360px;
  object-fit: contain;
  object-position: left bottom;
}

/* ----- Speech bubble (one self-contained image) ----- */
.products__bubble {
  position: absolute;
  z-index: 3;
  top: 24%;
  left: 56%;
  width: clamp(150px, 21vw, 240px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
}

/* ----- Category grid ----- */
.products__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 16px;
  justify-items: center;
  padding: 32px 32px 32px 0;
}

/* ========================================================
   Responsive
   ======================================================== */
@media (max-width: 1023px) {
  .products__panel-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .products__girl {
    min-height: 300px;
    justify-content: center;
  }
  .products__girl-img {
    max-height: 300px;
    max-width: 70%;
    object-position: center bottom;
  }
  .products__girl-backdrop {
    left: 50%;
    max-width: 380px;
  }
  .products__bubble {
    top: 14%;
    left: 58%;
    width: clamp(140px, 30vw, 210px);
  }
  .products__grid {
    padding: 0 24px 28px;
  }
}

@media (max-width: 600px) {
  .products { padding: 40px 0; }
  .products__girl-img { max-width: 78%; }
  .products__bubble {
    top: 6%;
    left: 54%;
    width: 150px;
  }
  .products__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 12px;
    padding: 0 16px 24px;
  }
}
</style>
