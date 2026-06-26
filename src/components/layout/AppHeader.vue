<script setup>
import { ref, computed } from 'vue'
import { useContent } from '../../composables/useContent.js'
import LogoMark from '../ui/LogoMark.vue'
import IconButton from '../ui/IconButton.vue'

/**
 * AppHeader — site header.
 *
 * Desktop (>=1024px):
 *   - Logo on the left
 *   - Top row:    [Region] [Main categories]                  [Cart] [Login]
 *   - Bottom row: [Secondary nav: О нас, Франшиза, Контакты]  [Работа]
 *
 * Tablet / mobile:
 *   - Logo on the left, cart + burger on the right
 *   - Burger toggles a slide-in drawer containing every link
 *
 * All nav items are loaded from /data/content.json so they stay in
 * one place and can be reused by the footer or category pages later.
 */

const { data } = useContent()

const mainNav      = computed(() => data.value?.mainNav      ?? [])
const secondaryNav = computed(() => data.value?.secondaryNav ?? [])

const drawerOpen = ref(false)
function toggleDrawer() { drawerOpen.value = !drawerOpen.value }
function closeDrawer()  { drawerOpen.value = false }

// Cart count is mocked for now — will come from a cart store later.
const cartCount = ref(0)
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <!-- Logo -->
      <div class="header__logo">
        <LogoMark :size="72" />
      </div>

      <!-- ============= DESKTOP / TABLET LAYOUT ============= -->
      <div class="header__content">
        <!-- Top row -->
        <div class="header__row header__row--top">
          <button class="header__region" type="button">
            <img src="/images/pin.png" alt="" class="header__region-icon" />
            <span>Ваш регион</span>
          </button>

          <nav class="header__nav header__nav--main" aria-label="Категории">
            <ul>
              <li v-for="item in mainNav" :key="item.id">
                <a :href="item.href">{{ item.title }}</a>
              </li>
            </ul>
          </nav>

          <div class="header__actions">
            <IconButton
              icon="/images/cart.png"
              label="Корзина"
              :badge="cartCount"
              icon-alt="Корзина"
            />
            <IconButton
              icon="/images/login.png"
              label="Войти"
              icon-alt="Войти"
            />
          </div>
        </div>

        <!-- Bottom row -->
        <div class="header__row header__row--bottom">
          <nav class="header__nav header__nav--secondary" aria-label="Разделы сайта">
            <ul>
              <li v-for="item in secondaryNav.filter(i => i.id !== 'work')" :key="item.id">
                <a :href="item.href">{{ item.title }}</a>
              </li>
            </ul>
          </nav>
          <a class="header__work" href="#work">Работа</a>
        </div>
      </div>

      <!-- ============= MOBILE: cart + burger ============= -->
      <div class="header__mobile-actions">
        <IconButton
          icon="/images/cart.png"
          :badge="cartCount"
          icon-alt="Корзина"
          label=""
        />
        <button
          class="header__burger"
          type="button"
          :aria-expanded="drawerOpen"
          aria-label="Открыть меню"
          @click="toggleDrawer"
        >
          <span :class="['header__burger-bars', { 'is-open': drawerOpen }]">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- ============= MOBILE DRAWER ============= -->
    <transition name="drawer">
      <div v-if="drawerOpen" class="drawer" @click.self="closeDrawer">
        <div class="drawer__panel">
          <button class="drawer__close" type="button" aria-label="Закрыть меню" @click="closeDrawer">×</button>

          <button class="drawer__region" type="button">
            <img src="/images/pin.png" alt="" />
            <span>Ваш регион</span>
          </button>

          <nav class="drawer__nav" aria-label="Категории">
            <p class="drawer__group-title">Категории</p>
            <ul>
              <li v-for="item in mainNav" :key="item.id">
                <a :href="item.href" @click="closeDrawer">{{ item.title }}</a>
              </li>
            </ul>
          </nav>

          <nav class="drawer__nav" aria-label="Разделы сайта">
            <p class="drawer__group-title">О компании</p>
            <ul>
              <li v-for="item in secondaryNav" :key="item.id">
                <a :href="item.href" @click="closeDrawer">{{ item.title }}</a>
              </li>
            </ul>
          </nav>

          <a href="#login" class="drawer__login" @click="closeDrawer">
            <img src="/images/login.png" alt="" />
            <span>Войти</span>
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* ========================================================
   Base header layout — desktop / tablet first
   ======================================================== */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}
.header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.header__logo { flex: 0 0 auto; }

.header__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.header__row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: nowrap;
}
.header__row--top    { justify-content: space-between; }
.header__row--bottom {
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px dashed var(--color-border);
}

/* Region button */
.header__region {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.header__region:hover { color: var(--color-green); }
.header__region-icon { width: 14px; height: 14px; }

/* Main category nav */
.header__nav ul {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}
.header__nav a {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  position: relative;
  transition: color var(--t-fast);
  white-space: nowrap;
}
.header__nav a:hover { color: var(--color-green); }
.header__nav a::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -4px;
  height: 2px;
  background: var(--color-green);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--t-base);
}
.header__nav a:hover::after { transform: scaleX(1); }

.header__nav--secondary ul { gap: 28px; }
.header__nav--secondary a {
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Actions (cart, login) */
.header__actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.header__work {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--t-fast);
}
.header__work:hover { color: var(--color-green); }

/* Mobile actions hidden on desktop */
.header__mobile-actions { display: none; }

/* ========================================================
   Tablet / mobile  (< 1024px)
   ======================================================== */
@media (max-width: 1023px) {
  .header__content        { display: none; }
  .header__mobile-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }
  .header__inner { gap: 12px; padding-top: 8px; padding-bottom: 8px; }
}

/* Burger button */
.header__burger {
  width: 40px; height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.header__burger-bars {
  position: relative;
  width: 24px; height: 18px;
  display: inline-block;
}
.header__burger-bars span {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform var(--t-base), opacity var(--t-base), top var(--t-base);
}
.header__burger-bars span:nth-child(1) { top: 0; }
.header__burger-bars span:nth-child(2) { top: 8px; }
.header__burger-bars span:nth-child(3) { top: 16px; }
.header__burger-bars.is-open span:nth-child(1) { top: 8px; transform: rotate(45deg); }
.header__burger-bars.is-open span:nth-child(2) { opacity: 0; }
.header__burger-bars.is-open span:nth-child(3) { top: 8px; transform: rotate(-45deg); }

/* ========================================================
   Mobile drawer
   ======================================================== */
.drawer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}
.drawer__panel {
  width: min(320px, 85vw);
  height: 100%;
  background: #fff;
  padding: 24px 24px 32px;
  overflow-y: auto;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.1);
}
.drawer__close {
  position: absolute;
  top: 12px; right: 16px;
  width: 36px; height: 36px;
  font-size: 28px;
  line-height: 1;
  color: var(--color-text);
}
.drawer__region {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
}
.drawer__region img { width: 16px; height: 16px; }
.drawer__group-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.drawer__nav { margin-bottom: 24px; }
.drawer__nav ul { display: flex; flex-direction: column; gap: 12px; }
.drawer__nav a {
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 6px 0;
  display: block;
  transition: color var(--t-fast);
}
.drawer__nav a:hover { color: var(--color-green); }
.drawer__login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-green);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  transition: background var(--t-fast);
}
.drawer__login:hover { background: var(--color-green-dark); }
.drawer__login img { width: 18px; height: 18px; filter: brightness(0) invert(1); }

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity var(--t-base); }
.drawer-enter-from, .drawer-leave-to       { opacity: 0; }
.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel        { transition: transform var(--t-base); }
.drawer-enter-from   .drawer__panel        { transform: translateX(100%); }
.drawer-leave-to     .drawer__panel        { transform: translateX(100%); }

/* ========================================================
   Small / mid tablet adjustments
   ======================================================== */
@media (max-width: 1199px) and (min-width: 1024px) {
  .header__nav ul { gap: 14px; }
  .header__nav a  { font-size: 12px; }
  .header__actions { gap: 14px; }
}
</style>
