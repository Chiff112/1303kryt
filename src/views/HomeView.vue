<script setup>
import AppHeader          from '../components/layout/AppHeader.vue'
import AppFooter          from '../components/layout/AppFooter.vue'
import JoinUsBanner       from '../components/layout/JoinUsBanner.vue'
import HeroSection        from '../components/sections/HeroSection.vue'
import ProductsSection    from '../components/sections/ProductsSection.vue'
import BestSellersSection from '../components/sections/BestSellersSection.vue'
import DeliverySection    from '../components/sections/DeliverySection.vue'
import LoyaltySection     from '../components/sections/LoyaltySection.vue'
</script>

<template>
  <div id="top" class="home">
    <AppHeader />

    <main>
      <HeroSection />
      <ProductsSection />
      <BestSellersSection />
      <DeliverySection />
      <LoyaltySection />
    </main>

    <AppFooter />
    <JoinUsBanner />
  </div>
</template>
