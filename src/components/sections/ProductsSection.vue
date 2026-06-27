<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../../stores/content.js'
import SectionTitle from '../ui/SectionTitle.vue'
import CategoryCircle from '../ui/CategoryCircle.vue'

// Секция «Наша продукция»: девушка с облаком и сетка категорий.

const { data } = storeToRefs(useContentStore())
const categories = computed(() => data.value?.categories ?? [])
</script>

<template>
  <section class="products" id="products">
    <div class="container">
      <SectionTitle>Наша продукция</SectionTitle>
    </div>

    <div class="products__panel">
      <div class="products__panel-inner container">
        <!-- Слева: девушка со смузи, полукруг-фон и облако -->
        <div class="products__girl">
          <img
            src="/images/girl-backdrop.png"
            alt=""
            class="products__girl-backdrop"
            aria-hidden="true"
          />
          <img
            src="/images/girl-smoothie.png"
            alt="Девушка пьёт зелёный смузи"
            class="products__girl-img"
          />

          <!-- Готовое облако (текст уже на картинке) -->
          <img
            src="/images/bubble-products.png"
            alt="Полезно и питательно!"
            class="products__bubble"
          />
        </div>

        <!-- Справа: сетка кружков-категорий 4×2 -->
        <div class="products__grid">
          <CategoryCircle
            v-for="cat in categories"
            :key="cat.id"
            :title="cat.title"
            :image="cat.image"
            :href="`#${cat.id}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.products {
  background: #fff;
  padding: 64px 0;
}

.products__panel {
  position: relative;
  background-image: url('/images/bg-products.png');
  background-size: cover;
  background-position: center;
  background-color: var(--color-green); /* fallback */
  overflow: hidden;
}
.products__panel-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.3fr);
  align-items: center;
  gap: 24px;
  min-height: 360px;
}

/* ----- Колонка с девушкой ----- */
.products__girl {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  min-height: 360px;
}

/* Мягкий зелёный полукруг за девушкой */
.products__girl-backdrop {
  position: absolute;
  bottom: 0;
  left: 38%;
  width: 90%;
  max-width: 460px;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  opacity: 0.85;
}

/* Фото девушки — прижато к левому краю */
.products__girl-img {
  position: relative;
  z-index: 2;
  width: auto;
  max-width: 92%;
  max-height: 360px;
  object-fit: contain;
  object-position: left bottom;
}

/* ----- Облако (готовая картинка) ----- */
.products__bubble {
  position: absolute;
  z-index: 3;
  top: 14%;
  left: 56%;
  width: clamp(150px, 21vw, 240px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
}

/* ----- Сетка категорий ----- */
.products__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 16px;
  justify-items: center;
  padding: 32px 32px 32px 0;
}

/* Адаптив (под телефоны) */
@media (max-width: 1023px) {
  .products__panel-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .products__girl {
    min-height: 300px;
    justify-content: center;
  }
  .products__girl-img {
    max-height: 300px;
    max-width: 70%;
    object-position: center bottom;
  }
  .products__girl-backdrop {
    left: 50%;
    max-width: 380px;
  }
  .products__bubble {
    top: 14%;
    left: 58%;
    width: clamp(140px, 30vw, 210px);
  }
  .products__grid {
    padding: 0 24px 28px;
  }
}

@media (max-width: 600px) {
  .products { padding: 40px 0; }
  /* На телефоне девушку и облако прячем — оставляем только кружки */
  .products__girl { display: none; }
  .products__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 12px;
    padding: 32px 16px;
  }
}
</style>
