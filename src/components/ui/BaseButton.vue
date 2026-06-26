<script setup>
/**
 * BaseButton — primary CTA. Used in product cards ("В корзину"),
 * the loyalty section ("Получить"), and any other call-to-action.
 *
 * Variants (`type` prop):
 *   - primary  → yellow pill (default)
 *   - outline  → bordered transparent
 */
defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
  type:    { type: String, default: 'button' }
})
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background var(--t-fast), transform var(--t-fast), box-shadow var(--t-fast);
  white-space: nowrap;
}
.btn:active { transform: translateY(1px); }

/* Sizes */
.btn--sm { padding: 8px 14px;  font-size: 11px; }
.btn--md { padding: 10px 22px; font-size: 13px; }
.btn--lg { padding: 14px 30px; font-size: 15px; }

/* Variants */
.btn--primary {
  background: var(--color-yellow);
  color: var(--color-text);
  box-shadow: 0 3px 0 var(--color-yellow-dark);
}
.btn--primary:hover {
  background: #FFC638;
  box-shadow: 0 4px 0 var(--color-yellow-dark);
}

.btn--outline {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-text);
}
.btn--outline:hover {
  background: var(--color-text);
  color: #fff;
}
</style>
