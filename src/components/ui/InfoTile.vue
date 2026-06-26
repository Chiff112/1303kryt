<script setup>
// Маленький блок: иконка + заголовок + описание.
// Используется в способах оплаты и доставки.
defineProps({
  icon:        { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  layout:      { type: String, default: 'horizontal' }   // 'horizontal' | 'vertical'
})
</script>

<template>
  <div :class="['info-tile', `info-tile--${layout}`]">
    <div class="info-tile__icon-wrap">
      <img :src="icon" :alt="title" class="info-tile__icon" />
    </div>
    <div class="info-tile__body">
      <h4 class="info-tile__title">{{ title }}</h4>
      <p v-if="description" class="info-tile__desc">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.info-tile {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.info-tile--vertical {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-tile__icon-wrap {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.info-tile__icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info-tile__body { min-width: 0; }
.info-tile__title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text);
  margin: 0 0 4px;
}
.info-tile__desc {
  font-size: 11px;
  line-height: 1.35;
  color: var(--color-text);
  opacity: 0.85;
  margin: 0;
}
</style>
