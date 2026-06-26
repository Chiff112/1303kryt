<script setup>
/**
 * CategoryCircle — a circular product-category card.
 * Shows a round image on top and an uppercase white label below.
 * Used 8 times in the "Наша продукция" grid; can be reused on any
 * other page that needs to navigate the catalogue.
 */
defineProps({
  title: { type: String, required: true },
  image: { type: String, required: true },
  href:  { type: String, default: '#' },
  alt:   { type: String, default: '' }
})
</script>

<template>
  <a :href="href" class="cat-circle">
    <span class="cat-circle__ring">
      <img :src="image" :alt="alt || title" class="cat-circle__img" />
    </span>
    <span class="cat-circle__title">{{ title }}</span>
  </a>
</template>

<style scoped>
.cat-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  transition: transform var(--t-base);
}
.cat-circle:hover { transform: translateY(-4px); }

.cat-circle__ring {
  position: relative;
  display: block;
  width: clamp(80px, 12vw, 120px);
  height: clamp(80px, 12vw, 120px);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: box-shadow var(--t-base);
}
.cat-circle:hover .cat-circle__ring {
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}
.cat-circle__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.cat-circle__title {
  font-size: clamp(11px, 1.1vw, 14px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  line-height: 1.15;
  max-width: 110px;
}
</style>
