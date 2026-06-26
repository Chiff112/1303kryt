<script setup>
// Постоянный каркас сайта. Шапка, подвал, баннер и попап корзины
// видны всегда, а <RouterView> просто меняет текущую страницу.
import AppHeader    from './components/layout/AppHeader.vue'
import AppFooter    from './components/layout/AppFooter.vue'
import JoinUsBanner from './components/layout/JoinUsBanner.vue'
import CartPopup    from './components/ui/CartPopup.vue'
</script>

<template>
  <div id="top" class="app">
    <AppHeader />

    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>

    <AppFooter />
    <JoinUsBanner />

    <!-- Всплывающая корзина (показывается после добавления товара) -->
    <CartPopup />
  </div>
</template>
