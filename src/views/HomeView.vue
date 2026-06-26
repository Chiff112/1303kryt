<script setup>
import HeroSection        from '../components/sections/HeroSection.vue'
import ProductsSection    from '../components/sections/ProductsSection.vue'
import BestSellersSection from '../components/sections/BestSellersSection.vue'
import DeliverySection    from '../components/sections/DeliverySection.vue'
import LoyaltySection     from '../components/sections/LoyaltySection.vue'
import SectionDivider     from '../components/ui/SectionDivider.vue'

/**
 * HomeView — the landing page ("/").
 * Pure presentation: stacks the marketing sections with dashed
 * dividers between them. All data is loaded from JSON inside each
 * section via the content store.
 */
</script>

<template>
  <main>
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
