<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import SectionTitle from '../ui/SectionTitle.vue'
import CategoryCircle from '../ui/CategoryCircle.vue'

/**
 * ProductsSection — "Наша продукция".
 *
 * Layout:
 *   - White outer band with the section title.
 *   - Rounded green panel (`bg-products.png`).
 *   - Left: the girl drinking a smoothie standing in front of a green
 *     semicircle backdrop, with a white speech bubble whose tail points
 *     at her mouth so she appears to be saying the phrase.
 *   - Right: 4×2 grid of category circles (data-driven from JSON).
 */

const { data } = useContent()
const categories = computed(() => data.value?.categories ?? [])
</script>

<template>
  <section class="products" id="products">
    <div class="container">
      <SectionTitle>Наша продукция</SectionTitle>

      <div class="products__panel">
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

          <div class="products__bubble" aria-hidden="true">
            <img src="/images/cloud.png" alt="" class="products__bubble-cloud" />
            <img src="/images/phrase.png" alt="" class="products__bubble-text" />
          </div>
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
  border-radius: var(--radius-md);
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  align-items: center;
  gap: 32px;
  min-height: 380px;
  overflow: hidden;
}

/* ----- Girl column ----- */
.products__girl {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 340px;
}

/* Semicircle backdrop sits BEHIND the girl */
.products__girl-backdrop {
  position: absolute;
  bottom: -32px;            /* hugs the bottom of the panel */
  left: 50%;
  width: 105%;
  max-width: 520px;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
}

/* Girl photo — natural colors (no blend), but edges softly faded
   so the stock image's white background blends into the green panel */
.products__girl-img {
  position: relative;
  z-index: 2;
  width: auto;
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  -webkit-mask-image: radial-gradient(ellipse 72% 90% at 50% 55%, #000 62%, transparent 100%);
          mask-image: radial-gradient(ellipse 72% 90% at 50% 55%, #000 62%, transparent 100%);
}

/* ----- Speech bubble ----- */
.products__bubble {
  position: absolute;
  top: 6%;
  right: -4%;
  width: clamp(150px, 19vw, 230px);
  z-index: 3;
  pointer-events: none;
}
/* Flip the cloud horizontally so its tail points LEFT — i.e. down toward
   the girl's mouth — as if she's the one speaking. */
.products__bubble-cloud {
  display: block;
  width: 100%;
  height: auto;
  transform: scaleX(-1) rotate(6deg);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}
.products__bubble-text {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 78%;
  height: auto;
  object-fit: contain;
  transform: rotate(-4deg); /* gentle text tilt, like in the design */
}

/* ----- Category grid ----- */
.products__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 16px;
  justify-items: center;
}

/* ========================================================
   Responsive
   ======================================================== */
@media (max-width: 1023px) {
  .products__panel {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
  .products__girl       { min-height: 260px; }
  .products__girl-img   { max-height: 280px; }
  .products__girl-backdrop {
    max-width: 380px;
    bottom: -20px;
  }
  .products__bubble {
    top: 2%;
    right: 4%;
    width: clamp(120px, 26vw, 180px);
  }
}

@media (max-width: 600px) {
  .products { padding: 40px 0; }
  .products__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 12px;
  }
  .products__bubble {
    top: 0;
    right: 2%;
    width: 130px;
  }
  .products__girl-img { max-height: 240px; }
}
</style>
