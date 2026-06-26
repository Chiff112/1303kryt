<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import SectionTitle from '../ui/SectionTitle.vue'
import BaseButton from '../ui/BaseButton.vue'

// Секция «Наша система лояльности»: карта клиента и список выгод.

const { data } = storeToRefs(useContentStore())
const benefits = computed(() => data.value?.loyaltyBenefits ?? [])
</script>

<template>
  <section class="loyalty" id="loyalty">
    <div class="container">
      <SectionTitle>Наша система лояльности</SectionTitle>

      <div class="loyalty__grid">
        <!-- ============ Слева: карта клиента ============ -->
        <div class="loyalty__card-wrap">
          <img
            src="/images/virtual-card.png"
            alt="Виртуальная карта Vita Juice"
            class="loyalty__card"
          />
        </div>

        <!-- ============ Справа: текст, выгоды и кнопка ============ -->
        <div class="loyalty__content">
          <h3 class="loyalty__subtitle">С картой вы получаете</h3>

          <ul class="loyalty__benefits">
            <li v-for="b in benefits" :key="b.id" class="loyalty__benefit">
              <img :src="b.icon" :alt="b.title" class="loyalty__benefit-icon" />
              <span class="loyalty__benefit-title">{{ b.title }}</span>
            </li>
          </ul>

          <div class="loyalty__cta">
            <span class="loyalty__cta-text">Хотите оформить?</span>
            <BaseButton variant="primary" size="md">Получить</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.loyalty {
  background: #fff;
  padding: 56px 0;
}

.loyalty__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 48px;
  align-items: center;
}

/* ----- Колонка с картой ----- */
.loyalty__card-wrap {
  display: flex;
  justify-content: center;
}
.loyalty__card {
  width: 100%;
  max-width: 380px;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

/* ----- Колонка с текстом ----- */
.loyalty__content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loyalty__subtitle {
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 0;
}

/* ----- Выгоды ----- */
.loyalty__benefits {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
}
.loyalty__benefit {
  display: flex;
  align-items: center;
  gap: 16px;
}
.loyalty__benefit-icon {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex: 0 0 auto;
}
.loyalty__benefit-title {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.35;
}

/* ----- Кнопка ----- */
.loyalty__cta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.loyalty__cta-text {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text);
}

/* Адаптив (под телефоны) */
@media (max-width: 900px) {
  .loyalty__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .loyalty__card { max-width: 320px; }
}

@media (max-width: 480px) {
  .loyalty       { padding: 40px 0; }
  .loyalty__cta  { gap: 12px; }
}
</style>
