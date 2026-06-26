<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import ProductsSection from '../components/sections/ProductsSection.vue'
import BestSellersSection from '../components/sections/BestSellersSection.vue'
</script>

<template>
  <div id="top" class="home">
    <AppHeader />

    <main>
      <HeroSection />
      <ProductsSection />
      <BestSellersSection />

      <!-- Step 4 done. Next:
             - DeliverySection (Step 5 — "Доставка и оплата")
             - LoyaltySection (Step 6 — "Наша система лояльности")
             - AppFooter + JoinUsBanner (Step 7)
      -->
    </main>
  </div>
</template>
