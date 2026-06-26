<script setup>
/**
 * LogoMark — the Vita Juice circular logo.
 * Reusable brand mark; links to the home route ("/").
 */
defineProps({
  size: { type: [Number, String], default: 80 }
})
</script>

<template>
  <RouterLink to="/" class="logo-mark" :style="{ width: size + 'px', height: size + 'px' }" aria-label="Vita Juice — на главную">
    <img src="/images/logo.png" alt="Vita Juice" class="logo-mark__img" />
  </RouterLink>
</template>

<style scoped>
.logo-mark {
  display: inline-block;
  flex: 0 0 auto;
  transition: transform var(--t-fast);
}
.logo-mark:hover { transform: scale(1.05); }
.logo-mark__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
