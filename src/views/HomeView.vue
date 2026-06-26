<script setup>
import { ref } from 'vue'
import AppHeader          from '../components/layout/AppHeader.vue'
import AppFooter          from '../components/layout/AppFooter.vue'
import JoinUsBanner       from '../components/layout/JoinUsBanner.vue'
import HeroSection        from '../components/sections/HeroSection.vue'
import ProductsSection    from '../components/sections/ProductsSection.vue'
import BestSellersSection from '../components/sections/BestSellersSection.vue'
import DeliverySection    from '../components/sections/DeliverySection.vue'
import LoyaltySection     from '../components/sections/LoyaltySection.vue'
import JuicesSection      from '../components/sections/JuicesSection.vue'
import SectionDivider     from '../components/ui/SectionDivider.vue'
import CartPopup          from '../components/ui/CartPopup.vue'

/**
 * HomeView — top-level page.
 *
 * A lightweight `view` switch toggles between the landing page ("home")
 * and the juices category page ("juices") without a router, keeping the
 * project within the "no extra frameworks" rule. The header emits
 * `navigate` to drive it.
 */
const view = ref('home')

function navigate(target) {
  view.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div id="top" class="home">
    <AppHeader @navigate="navigate" />

    <!-- Landing page -->
    <main v-if="view === 'home'">
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

    <!-- Juices category page -->
    <main v-else-if="view === 'juices'">
      <SectionDivider />
      <JuicesSection />
      <SectionDivider />
    </main>

    <AppFooter />
    <JoinUsBanner />

    <!-- Cart popup (shared across all views) -->
    <CartPopup />
  </div>
</template>
