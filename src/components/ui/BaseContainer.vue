<script setup>
/**
 * BaseContainer — limits content width and adds horizontal padding.
 * Used everywhere a section needs a constrained, centered column.
 */
defineProps({
  tag: { type: String, default: 'div' }
})
</script>

<template>
  <component :is="tag" class="container">
    <slot />
  </component>
</template>
