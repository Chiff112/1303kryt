<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'

// Зелёная плашка внизу страницы: «Присоединяйтесь к Vita Juice»
// и иконки соцсетей. Тексты и ссылки берутся из content.json.

const { data } = storeToRefs(useContentStore())
const joinUs = computed(() => data.value?.joinUs ?? null)
</script>

<template>
  <section v-if="joinUs" class="join-us">
    <div class="container join-us__inner">
      <h2 class="join-us__title">{{ joinUs.title }}</h2>

      <ul class="join-us__socials">
        <li v-for="s in joinUs.socials" :key="s.id">
          <a
            :href="s.url"
            class="join-us__social"
            target="_blank"
            rel="noopener"
            :aria-label="s.title"
          >
            <img :src="s.icon" :alt="s.title" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.join-us {
  background: var(--color-green);
  padding: 22px 0;
}

.join-us__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.join-us__title {
  font-size: clamp(18px, 2.6vw, 28px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  margin: 0;
}

.join-us__socials {
  display: flex;
  align-items: center;
  gap: 14px;
}
.join-us__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--t-fast), box-shadow var(--t-fast);
}
.join-us__social:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}
.join-us__social img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .join-us__inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
