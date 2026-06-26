<script setup>
/**
 * SectionTitle — uppercase centered title used at the top of every
 * page section: "Наша продукция", "Хиты продаж", "Доставка и оплата",
 * "Наша система лояльности", etc.
 */
defineProps({
  tag: { type: String, default: 'h2' }
})
</script>

<template>
  <component :is="tag" class="section-title">
    <slot />
  </component>
</template>

<style scoped>
.section-title {
  text-align: center;
  font-size: clamp(22px, 3.6vw, 36px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 0 0 32px;
}
</style>
