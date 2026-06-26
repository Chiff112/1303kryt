<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import SectionTitle from '../ui/SectionTitle.vue'
import InfoTile from '../ui/InfoTile.vue'

/**
 * DeliverySection — "Доставка и оплата".
 *
 * Matches the Figma frame:
 *   - Green→yellow gradient panel (`bg-delivery.png`).
 *   - Left column: "Зона доставки" (zone legend + map),
 *     "Варианты оплаты" (3 InfoTiles), "Способы доставки" (2 InfoTiles).
 *   - Right column: delivery boy holding boxes, flush to the bottom.
 *   - A self-contained speech bubble (cloud + "Быстро и бесплатно!"
 *     baked into one PNG, tilted ~45°) sits upper-left of the boy,
 *     its tail pointing down-right toward his face.
 *
 * Data comes from /data/content.json.
 */

const { data } = storeToRefs(useContentStore())

const zones    = computed(() => data.value?.deliveryZones    ?? [])
const payments = computed(() => data.value?.paymentOptions   ?? [])
const ships    = computed(() => data.value?.deliveryOptions  ?? [])
</script>

<template>
  <section class="delivery" id="delivery">
    <div class="container">
      <SectionTitle>Доставка и оплата</SectionTitle>
    </div>

    <div class="delivery__panel">
      <div class="delivery__panel-inner container">
        <!-- ============ LEFT: info ============ -->
        <div class="delivery__info">
          <h3 class="delivery__heading">Зона доставки</h3>
          <ul class="delivery__zones">
            <li v-for="zone in zones" :key="zone.id" class="delivery__zone">
              <span class="delivery__zone-dot" :style="{ background: zone.color }"></span>
              <span>{{ zone.title }}</span>
            </li>
          </ul>
          <div class="delivery__map">
            <img src="/images/map.png" alt="Карта доставки" />
          </div>

          <h3 class="delivery__heading">Варианты оплаты</h3>
          <div class="delivery__options delivery__options--3">
            <InfoTile
              v-for="opt in payments"
              :key="opt.id"
              :icon="opt.icon"
              :title="opt.title"
              :description="opt.description"
            />
          </div>

          <h3 class="delivery__heading">Способы доставки</h3>
          <div class="delivery__options delivery__options--2">
            <InfoTile
              v-for="opt in ships"
              :key="opt.id"
              :icon="opt.icon"
              :title="opt.title"
              :description="opt.description"
            />
          </div>
        </div>

        <!-- ============ RIGHT: delivery boy + speech bubble ============ -->
        <div class="delivery__hero">
          <img
            src="/images/delivery-boy.png"
            alt="Курьер с коробками заказа"
            class="delivery__hero-img"
          />
          <!-- Complete bubble (cloud + phrase, ~45° tilt baked in) -->
          <img
            src="/images/bubble-delivery.png"
            alt="Быстро и бесплатно!"
            class="delivery__bubble"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.delivery {
  background: #fff;
  padding: 56px 0;
}

.delivery__panel {
  position: relative;
  background-image: url('/images/bg-delivery.png');
  background-size: cover;
  background-position: center;
  background-color: var(--color-green); /* fallback */
  overflow: hidden;
}
.delivery__panel-inner {
  position: relative;
  padding-top: 32px;
  padding-bottom: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 32px;
  align-items: stretch;
}

/* ============ Left column ============ */
.delivery__info {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.delivery__heading {
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 12px 0 4px;
}
.delivery__heading:first-child { margin-top: 0; }

.delivery__zones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0;
  padding: 0;
}
.delivery__zone {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text);
  max-width: 200px;
  line-height: 1.3;
}
.delivery__zone-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex: 0 0 auto;
  margin-top: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.delivery__map {
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #fff;
}
.delivery__map img {
  width: 100%;
  height: auto;
  display: block;
}

.delivery__options {
  display: grid;
  gap: 18px;
}
.delivery__options--3 { grid-template-columns: repeat(3, 1fr); }
.delivery__options--2 { grid-template-columns: repeat(2, 1fr); }

/* ============ Right column ============ */
.delivery__hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 320px;
}
.delivery__hero-img {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
  object-position: center bottom;
  margin-bottom: -32px; /* boy sits on the panel's bottom edge */
}

/* ----- Speech bubble (one self-contained image, ~45° tilt baked in) ----- */
.delivery__bubble {
  position: absolute;
  z-index: 3;
  top: calc(2% + 90px);
  left: -2%;
  width: clamp(170px, 24vw, 280px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
}

/* ========================================================
   Responsive
   ======================================================== */
@media (max-width: 1023px) {
  .delivery__panel-inner {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 24px;
    padding-bottom: 24px;
  }
  .delivery__hero        { min-height: 380px; order: -1; }
  .delivery__hero-img    { max-height: 380px; margin-bottom: -24px; }
  .delivery__bubble {
    top: 0;
    left: 2%;
    width: clamp(150px, 32vw, 240px);
  }
}

@media (max-width: 640px) {
  .delivery { padding: 40px 0; }
  .delivery__options--3 { grid-template-columns: 1fr; gap: 12px; }
  .delivery__options--2 { grid-template-columns: 1fr; gap: 12px; }
  .delivery__zones      { gap: 6px 14px; }
  .delivery__hero-img   { max-height: 300px; }
  .delivery__bubble {
    width: 160px;
    left: 0;
  }
}
</style>
