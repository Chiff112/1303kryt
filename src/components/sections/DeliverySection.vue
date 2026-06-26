<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import SectionTitle from '../ui/SectionTitle.vue'
import InfoTile from '../ui/InfoTile.vue'

/**
 * DeliverySection — "Доставка и оплата".
 *
 * Green→yellow gradient panel:
 *   Left column:
 *     - Зона доставки      : map + 3 colored zone markers loaded from JSON
 *     - Варианты оплаты    : 3 payment options (InfoTile)
 *     - Способы доставки   : 2 delivery options (InfoTile)
 *   Right column:
 *     - Delivery boy holding boxes
 *     - White speech bubble "БЫСТРО И БЕСПЛАТНО!" (same cloud asset
 *       as the products section, reused via a CSS class flip)
 */

const { data } = useContent()

const zones    = computed(() => data.value?.deliveryZones    ?? [])
const payments = computed(() => data.value?.paymentOptions   ?? [])
const ships    = computed(() => data.value?.deliveryOptions  ?? [])
</script>

<template>
  <section class="delivery" id="delivery">
    <div class="container">
      <SectionTitle>Доставка и оплата</SectionTitle>

      <div class="delivery__panel">
        <!-- ============ LEFT: info ============ -->
        <div class="delivery__info">
          <!-- Zones + map -->
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

          <!-- Payment options -->
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

          <!-- Delivery options -->
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
          <div class="delivery__bubble" aria-hidden="true">
            <img src="/images/cloud.png" alt="" class="delivery__bubble-cloud" />
            <img src="/images/phrase-delivery.png" alt="Быстро и бесплатно!" class="delivery__bubble-text" />
          </div>
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
  border-radius: var(--radius-md);
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 32px;
  align-items: stretch;
  overflow: hidden;
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

/* Zone legend */
.delivery__zones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0;
  padding: 0;
}
.delivery__zone {
  display: inline-flex;
  align-items: center;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Map */
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

/* Option rows */
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
  max-height: 580px;
  object-fit: contain;
  margin-bottom: -32px; /* lets the boy "sit" on the panel's bottom edge */
}

/* Speech bubble — re-uses the same cloud asset as the products section
   but flipped the OTHER way so the tail points to the boy's face */
.delivery__bubble {
  position: absolute;
  top: 4%;
  left: -8%;
  width: clamp(150px, 20vw, 230px);
  z-index: 3;
  pointer-events: none;
}
.delivery__bubble-cloud {
  display: block;
  width: 100%;
  height: auto;
  /* No scaleX — keep the cloud's natural tail pointing right toward the boy */
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}
.delivery__bubble-text {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 70%;
  height: auto;
  object-fit: contain;
}

/* ========================================================
   Responsive
   ======================================================== */
@media (max-width: 1023px) {
  .delivery__panel {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
  .delivery__hero        { min-height: 360px; order: -1; }
  .delivery__hero-img    { max-height: 360px; margin-bottom: -24px; }
  .delivery__bubble {
    top: 4%;
    left: 2%;
    width: clamp(130px, 28vw, 200px);
  }
}

@media (max-width: 640px) {
  .delivery { padding: 40px 0; }
  .delivery__options--3 { grid-template-columns: 1fr; gap: 12px; }
  .delivery__options--2 { grid-template-columns: 1fr; gap: 12px; }
  .delivery__zones      { gap: 6px 14px; }
  .delivery__hero-img   { max-height: 280px; }
}
</style>
