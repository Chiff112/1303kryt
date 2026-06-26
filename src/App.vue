<script setup>
import AppHeader    from './components/layout/AppHeader.vue'
import AppFooter    from './components/layout/AppFooter.vue'
import JoinUsBanner from './components/layout/JoinUsBanner.vue'
import CartPopup    from './components/ui/CartPopup.vue'

/**
 * App — the persistent layout shell.
 *
 * Header, footer, join-us banner and the slide-in cart popup stay
 * mounted for the whole session; <RouterView> swaps the page content
 * (home / juices / cart / account / franchise).
 */
</script>

<template>
  <div id="top" class="app">
    <AppHeader />

    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>

    <AppFooter />
    <JoinUsBanner />

    <!-- Slide-in cart popup (quick add-to-cart feedback) -->
    <CartPopup />
  </div>
</template>
