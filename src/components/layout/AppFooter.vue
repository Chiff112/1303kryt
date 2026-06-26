<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useContentStore } from '../../stores/content.js'
import { useCartStore } from '../../stores/cart.js'

/**
 * AppFooter — legal-information footer with a small cart summary line.
 */

const { data } = storeToRefs(useContentStore())
const footer = computed(() => data.value?.footer ?? null)
const cart = useCartStore()
const router = useRouter()
</script>

<template>
  <footer v-if="footer" class="app-footer">
    <div class="container">
      <!-- Cart summary line -->
      <button
        v-if="cart.count"
        class="app-footer__cart"
        type="button"
        @click="router.push('/cart')"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h9.2a1 1 0 0 0 1-.8L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="20" r="1.4" fill="currentColor"/>
          <circle cx="18" cy="20" r="1.4" fill="currentColor"/>
        </svg>
        <span>В корзине {{ cart.count }} тов. на {{ cart.totalPrice }}₽</span>
      </button>

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
}

/* Cart summary line */
.app-footer__cart {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding: 10px 20px;
  background: var(--color-yellow);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 3px 0 var(--color-yellow-dark);
  transition: background var(--t-fast);
}
.app-footer__cart:hover { background: #FFC638; }

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
