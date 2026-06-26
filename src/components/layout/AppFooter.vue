<script setup>
import { computed } from 'vue'
import { useContent } from '../../composables/useContent.js'

/**
 * AppFooter — legal-information footer.
 *
 * Three columns on desktop:
 *   1. Section title + company info (rendered line by line from JSON)
 *   2. First links group (Публичная оферта, Политика конфиденциальности)
 *   3. Second links group (Пользовательское соглашение, Бонусная программа)
 *
 * Stacks vertically on mobile.
 */

const { data } = useContent()
const footer = computed(() => data.value?.footer ?? null)
</script>

<template>
  <footer v-if="footer" class="app-footer">
    <div class="container">
      <div class="app-footer__grid">
        <!-- Column 1: company info -->
        <div class="app-footer__col">
          <h3 class="app-footer__title">{{ footer.title }}</h3>
          <p class="app-footer__info">
            <span v-for="(line, i) in footer.companyInfo" :key="i">
              {{ line }}<br v-if="i < footer.companyInfo.length - 1" />
            </span>
          </p>
        </div>

        <!-- Columns 2..N: link groups -->
        <ul
          v-for="(group, gi) in footer.links"
          :key="gi"
          class="app-footer__col app-footer__links"
        >
          <li v-for="link in group" :key="link.href">
            <a :href="link.href">{{ link.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #fff;
  padding: 32px 0;
  border-top: 1px dashed var(--color-dashed);
}

.app-footer__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 1fr));
  gap: 32px 24px;
  align-items: start;
}

.app-footer__col { min-width: 0; }

.app-footer__title {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin: 0 0 8px;
}
.app-footer__info {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.app-footer__links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 22px; /* aligns with body text in column 1 */
}
.app-footer__links a {
  font-size: 13px;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
  transition: color var(--t-fast);
}
.app-footer__links a:hover { color: var(--color-green); }

@media (max-width: 768px) {
  .app-footer__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .app-footer__links { padding-top: 0; }
}
</style>
