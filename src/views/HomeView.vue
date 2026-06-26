<script setup>
import { ref } from 'vue'
import HeroSection        from '../components/sections/HeroSection.vue'
import ProductsSection    from '../components/sections/ProductsSection.vue'
import BestSellersSection from '../components/sections/BestSellersSection.vue'
import DeliverySection    from '../components/sections/DeliverySection.vue'
import LoyaltySection     from '../components/sections/LoyaltySection.vue'
import SectionDivider     from '../components/ui/SectionDivider.vue'

// Главная страница ("/"): секции лендинга, разделённые пунктиром.
// Пасхалка: кнопка «секрет» в левом верхнем углу. По клику всплывает картинка.

const showSecret = ref(false)
</script>

<template>
  <main class="home-main">
    <!-- Пасхалка: кнопка «секрет» в углу -->
    <button class="secret-egg" type="button" @click="showSecret = true">секрет</button>

    <!-- Всплывающая секретная картинка (клик по фону закрывает) -->
    <div v-if="showSecret" class="secret-overlay" @click="showSecret = false">
      <img src="/images/egg-picture-2.png" alt="Секрет" class="secret-overlay__img" />
    </div>

    <HeroSection />

    <SectionDivider />
    <ProductsSection />

    <SectionDivider />
    <BestSellersSection />

    <SectionDivider />
    <DeliverySection />

    <SectionDivider />
    <LoyaltySection />
    <SectionDivider />
  </main>
</template>

<style scoped>
.home-main { position: relative; }

/* Кнопка-пасхалка в левом верхнем углу */
.secret-egg {
  position: absolute;
  top: 64px;
  left: 14px;
  z-index: 20;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.85);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-fast), background var(--t-fast);
}
.secret-egg:hover { background: #fff; transform: translateY(-2px); }

/* Затемнённый фон с картинкой по центру */
.secret-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: pointer;
}
.secret-overlay__img {
  max-width: 90vw;
  max-height: 88vh;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
</style>
