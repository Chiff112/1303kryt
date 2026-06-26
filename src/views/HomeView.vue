<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
// Section components will be added one by one (hero, categories, etc.)
</script>

<template>
  <div id="top" class="home">
    <AppHeader />

    <!-- Step 1: header is done.
         Following steps will add:
           - HeroSection (Step 2)
           - CategoriesSection (Step 3)
           - BestSellersSection (Step 4)
           - DeliverySection (Step 5)
           - LoyaltySection (Step 6)
           - AppFooter + JoinUsBanner (Step 7)
    -->
    <main class="home__placeholder">
      <div class="container">
        <p>Шаг 1 готов — шапка сайта. Следующие секции будут добавлены далее.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home__placeholder {
  padding: 80px 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
