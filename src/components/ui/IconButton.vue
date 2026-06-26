<script setup>
/**
 * IconButton — a button with an icon image and an optional text label.
 * Used in the header for cart, login, region, burger, etc.
 */
defineProps({
  icon:    { type: String, default: '' },
  label:   { type: String, default: '' },
  badge:   { type: [String, Number], default: '' },
  iconAlt: { type: String, default: '' }
})
</script>

<template>
  <button class="icon-button" type="button">
    <img v-if="icon" :src="icon" :alt="iconAlt" class="icon-button__icon" />
    <span v-if="label" class="icon-button__label">
      {{ label }}<span v-if="badge !== ''" class="icon-button__badge"> ({{ badge }})</span>
    </span>
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: var(--color-text);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.icon-button:hover { color: var(--color-green); }
.icon-button__icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.icon-button__badge { color: var(--color-text-muted); }
</style>
