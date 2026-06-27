<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'

// Окно выбора региона («Ваш регион»). Показывает текущий город,
// кнопку «Да» и список городов. Города берутся из content.json.

const emit = defineEmits(['close', 'select'])

const { data } = storeToRefs(useContentStore())
const current = computed(() => data.value?.regions?.current ?? '')
const cities  = computed(() => data.value?.regions?.cities  ?? [])

function pick(city) {
  emit('select', city)
  emit('close')
}
function confirm() {
  emit('select', current.value)
  emit('close')
}
function close() { emit('close') }
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="region-modal" role="dialog" aria-modal="true" aria-label="Ваш регион">
      <!-- Шапка -->
      <div class="region-modal__header">
        <h2 class="region-modal__title">Ваш регион</h2>
        <button class="region-modal__close" type="button" aria-label="Закрыть" @click="close">×</button>
      </div>

      <!-- Содержимое -->
      <div class="region-modal__body">
        <p class="region-modal__question">Ваш город {{ current }}?</p>
        <button class="region-modal__yes" type="button" @click="confirm">Да</button>

        <p class="region-modal__list-title">Нет выбрать из списка</p>
        <ul class="region-modal__cities">
          <li v-for="city in cities" :key="city">
            <button
              class="region-modal__city"
              :class="{ 'is-current': city === current }"
              type="button"
              @click="pick(city)"
            >{{ city }}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(130, 130, 130, 0.55);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.region-modal {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

/* Шапка */
.region-modal__header {
  background: var(--color-yellow);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.region-modal__title {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 0;
}
.region-modal__close {
  font-size: 26px;
  line-height: 1;
  color: var(--color-text);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Содержимое */
.region-modal__body { padding: 24px; }

.region-modal__question {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text);
  margin: 0 0 14px;
}
.region-modal__yes {
  display: inline-block;
  background: var(--color-yellow);
  color: var(--color-text);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 13px;
  padding: 8px 26px;
  border-radius: var(--radius-pill);
  box-shadow: 0 3px 0 var(--color-yellow-dark);
  transition: background var(--t-fast);
  margin-bottom: 22px;
}
.region-modal__yes:hover { background: #FFC638; }

.region-modal__list-title {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text);
  margin: 0 0 14px;
}

.region-modal__cities {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 16px;
}
.region-modal__city {
  text-align: left;
  font-size: 14px;
  color: var(--color-text);
  transition: color var(--t-fast);
}
.region-modal__city:hover { color: var(--color-yellow-dark); }
.region-modal__city.is-current { color: var(--color-yellow-dark); font-weight: 600; }

@media (max-width: 520px) {
  .region-modal__cities { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 380px) {
  /* На узком телефоне города в один столбец, как на макете */
  .region-modal__cities { grid-template-columns: 1fr; }
}
</style>
