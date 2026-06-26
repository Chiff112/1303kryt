<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import HeroSection from '../components/sections/HeroSection.vue'
// Following sections will be added one by one
</script>

<template>
  <div id="top" class="home">
    <AppHeader />

    <main>
      <HeroSection />

      <!-- Step 2 done. Following steps will add:
             - CategoriesSection (Step 3 — "Наша продукция")
             - BestSellersSection (Step 4 — "Хиты продаж")
             - DeliverySection (Step 5 — "Доставка и оплата")
             - LoyaltySection (Step 6 — "Наша система лояльности")
             - AppFooter + JoinUsBanner (Step 7)
      -->
    </main>
  </div>
</template>
