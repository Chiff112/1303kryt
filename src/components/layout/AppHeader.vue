<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useContentStore } from '../../stores/content.js'
import { useCartStore } from '../../stores/cart.js'
import { useAuthStore } from '../../stores/auth.js'
import LogoMark from '../ui/LogoMark.vue'
import LoginModal from '../ui/LoginModal.vue'
import RegionModal from '../ui/RegionModal.vue'

/**
 * AppHeader — site header.
 *
 * Desktop (>=1024px): a single horizontal row sitting on a dashed line.
 *   Logo | Region + main category links (each with a color dot that
 *   fills on hover) | secondary links (dark dots) | Корзина | Никита/Войти
 *   Region / Корзина / login text turn yellow on hover or when active.
 *
 * Mobile/tablet: logo + cart + burger that opens a slide-in drawer.
 *
 * Region picker and login open real modal components.
 * All nav data comes from /data/content.json.
 */

const { data } = storeToRefs(useContentStore())

const mainNav      = computed(() => data.value?.mainNav      ?? [])
const secondaryNav = computed(() => data.value?.secondaryNav ?? [])

const drawerOpen = ref(false)
function toggleDrawer() { drawerOpen.value = !drawerOpen.value }
function closeDrawer()  { drawerOpen.value = false }

// Modals
const showLogin  = ref(false)
const showRegion = ref(false)

// Region + auth state
const currentRegion = computed(() => data.value?.regions?.current ?? 'Ваш регион')
const selectedRegion = ref(null)
const regionLabel = computed(() => selectedRegion.value || 'Ваш регион')

const userName = computed(() => auth.displayName) // null = not logged in

// Shared stores
const cart = useCartStore()
const auth = useAuthStore()

// Router
const router = useRouter()
const route = useRoute()

// active-state helpers for nav highlighting
const isAccount = computed(() => route.path === '/account')
function isSecondaryActive(id) {
  return id === 'franchise' && route.path === '/franchise'
}

function onRegionSelect(city) { selectedRegion.value = city }
function openLogin()  { showLogin.value = true;  closeDrawer() }
function openRegion() { showRegion.value = true; closeDrawer() }
function goJuices()   { router.push('/juices');    closeDrawer() }
function goCart()     { router.push('/cart');      closeDrawer() }
function goFranchise(){ router.push('/franchise'); closeDrawer() }

// Click on the user chip: logged in → personal area, otherwise login.
function onUserClick() {
  if (auth.isLoggedIn) { router.push('/account'); closeDrawer() }
  else openLogin()
}
// After a successful login, go straight to the personal area.
function onLoginSuccess() { router.push('/account') }
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <!-- Logo (LogoMark is a RouterLink to "/") — straddles the header
           edge, hanging halfway over the section below. -->
      <div class="header__logo">
        <LogoMark :size="120" />
      </div>

      <!-- ============= DESKTOP LAYOUT ============= -->
      <div class="header__content">
        <!-- Top row: region + actions -->
        <div class="header__top">
          <button
            class="header__chip header__chip--region"
            :class="{ 'is-active': selectedRegion }"
            type="button"
            @click="openRegion"
          >
            <img src="/images/pin.png" alt="" class="header__chip-pin" />
            <span>{{ regionLabel }}</span>
            <img src="/images/chevron.png" alt="" class="header__chip-chevron" />
          </button>

          <div class="header__actions">
            <button class="header__chip" type="button" @click="goCart">
              <span>Корзина ({{ cart.count }})</span>
              <svg class="header__cart-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h9.2a1 1 0 0 0 1-.8L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="20" r="1.4" fill="currentColor"/>
                <circle cx="18" cy="20" r="1.4" fill="currentColor"/>
              </svg>
              <span v-if="cart.count" class="header__cart-sum">{{ cart.totalPrice }}₽</span>
            </button>

            <button class="header__chip" :class="{ 'is-active': isAccount }" type="button" @click="onUserClick">
              <span>{{ userName || 'Войти' }}</span>
              <img src="/images/sun.png" alt="" class="header__sun-icon" />
            </button>
          </div>
        </div>

        <!-- Bottom row: nav on the dashed line -->
        <nav class="header__nav" aria-label="Навигация">
          <ul class="header__nav-list">
            <li v-for="item in mainNav" :key="item.id" class="header__nav-item">
              <a
                :href="item.href"
                class="header__nav-link"
                :style="{ '--dot': item.color }"
                @click.prevent="item.id === 'juice' ? goJuices() : null"
              >
                <span class="header__nav-text">{{ item.title }}</span>
                <span class="header__dot"></span>
              </a>
            </li>

            <li class="header__nav-spacer" aria-hidden="true"></li>

            <li v-for="item in secondaryNav" :key="item.id" class="header__nav-item">
              <a
                :href="item.href"
                class="header__nav-link header__nav-link--secondary"
                :class="{ 'is-active': isSecondaryActive(item.id) }"
                :style="{ '--dot': item.color }"
                @click.prevent="item.id === 'franchise' ? goFranchise() : null"
              >
                <span class="header__nav-text">{{ item.title }}</span>
                <span class="header__dot"></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- ============= MOBILE: cart + burger ============= -->
      <div class="header__mobile-actions">
        <button class="header__mobile-cart" type="button" aria-label="Корзина" @click="goCart">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h9.2a1 1 0 0 0 1-.8L21 8H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="20" r="1.4" fill="currentColor"/>
            <circle cx="18" cy="20" r="1.4" fill="currentColor"/>
          </svg>
          <span v-if="cart.count" class="header__mobile-cart-badge">{{ cart.count }}</span>
        </button>
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

          <button class="drawer__region" type="button" @click="openRegion">
            <img src="/images/pin.png" alt="" />
            <span>{{ regionLabel }}</span>
          </button>

          <nav class="drawer__nav" aria-label="Категории">
            <p class="drawer__group-title">Категории</p>
            <ul>
              <li v-for="item in mainNav" :key="item.id">
                <a
                  :href="item.href"
                  class="drawer__link"
                  @click="item.id === 'juice' ? goJuices() : closeDrawer()"
                >
                  <span class="drawer__dot" :style="{ background: item.color }"></span>
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </nav>

          <nav class="drawer__nav" aria-label="Разделы сайта">
            <p class="drawer__group-title">О компании</p>
            <ul>
              <li v-for="item in secondaryNav" :key="item.id">
                <a
                  :href="item.href"
                  class="drawer__link"
                  @click="item.id === 'franchise' ? goFranchise() : closeDrawer()"
                >{{ item.title }}</a>
              </li>
            </ul>
          </nav>

          <button class="drawer__login" @click="onUserClick">
            <span>{{ userName || 'Войти' }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ============= MODALS ============= -->
    <LoginModal v-if="showLogin" @close="showLogin = false" @success="onLoginSuccess" />
    <RegionModal v-if="showRegion" @close="showRegion = false" @select="onRegionSelect" />
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  box-shadow: var(--shadow-sm);
  overflow: visible;
}
.header__inner {
  display: flex;
  align-items: stretch;
  gap: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.header__logo {
  flex: 0 0 auto;
  align-self: flex-start;       /* opt out of stretch */
  line-height: 0;
  margin-bottom: -46px;         /* lets the lower half hang below the header */
  position: relative;
  z-index: 60;
  cursor: pointer;
}

.header__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

/* ---------- Top row ---------- */
.header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.header__actions {
  display: flex;
  align-items: center;
  gap: 28px;
}

/* Chip = region / cart / login text+icon button */
.header__chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-text);
  transition: color var(--t-fast);
  white-space: nowrap;
}
.header__chip:hover,
.header__chip.is-active { color: var(--color-yellow-dark); }
.header__chip--region { color: var(--color-text-muted); }
.header__chip-pin     { width: 14px; height: 18px; object-fit: contain; }
.header__chip-chevron { width: 11px; height: 10px; object-fit: contain; opacity: 0.6; }
.header__cart-icon   { color: currentColor; }
.header__sun-icon    { width: 22px; height: 22px; object-fit: contain; }
.header__cart-sum {
  font-weight: 800;
  color: var(--color-yellow-dark);
}

/* ---------- Bottom nav ---------- */
.header__nav {
  position: relative;
  padding: 14px 0 4px;
}
.header__nav-list {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  position: relative;
  z-index: 1;
}
.header__nav-spacer { flex: 1 1 auto; }

.header__nav-item { flex: 0 0 auto; }
.header__nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.header__nav-text {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: var(--color-text);
  transition: color var(--t-fast);
  white-space: nowrap;
}
/* The dot under each item: gray by default, fills with --dot on hover */
.header__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #D8D9D9;
  transition: background var(--t-fast), transform var(--t-fast);
}
.header__nav-link:hover .header__nav-text { color: var(--dot); }
.header__nav-link:hover .header__dot {
  background: var(--dot);
  transform: scale(1.1);
}
/* secondary links: text turns to its (dark) dot color, dot fills dark */
.header__nav-link--secondary:hover .header__nav-text { color: var(--dot); }
.header__nav-link--secondary.is-active .header__dot { background: var(--dot); }
.header__nav-link--secondary.is-active .header__nav-text { color: var(--dot); }

/* ---------- Mobile actions ---------- */
.header__mobile-actions { display: none; }
.header__mobile-cart {
  position: relative;
  color: var(--color-text);
}
.header__mobile-cart-badge {
  position: absolute;
  top: -6px; right: -8px;
  min-width: 16px; height: 16px;
  padding: 0 4px;
  background: var(--color-yellow);
  color: var(--color-text);
  font-size: 10px;
  font-weight: 800;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Burger */
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

/* ---------- Responsive ---------- */
@media (max-width: 1199px) and (min-width: 1024px) {
  .header__nav-list { gap: 14px; }
  .header__nav-text { font-size: 12px; }
  .header__actions  { gap: 18px; }
}
@media (max-width: 1023px) {
  .header__content        { display: none; }
  .header__logo :deep(.logo-mark) { width: 78px !important; height: 78px !important; }
  .header__logo { margin-bottom: -28px; }
  .header__mobile-actions {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-left: auto;
  }
  .header__inner { gap: 12px; align-items: center; }
}

/* ---------- Drawer ---------- */
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
.drawer__region img { width: 16px; height: 20px; }
.drawer__group-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.drawer__nav { margin-bottom: 24px; }
.drawer__nav ul { display: flex; flex-direction: column; gap: 12px; }
.drawer__link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 6px 0;
  transition: color var(--t-fast);
}
.drawer__link:hover { color: var(--color-green); }
.drawer__dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  flex: 0 0 auto;
}
.drawer__login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: var(--color-yellow);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 3px 0 var(--color-yellow-dark);
  transition: background var(--t-fast);
}
.drawer__login:hover { background: #FFC638; }

/* Drawer transition */
.drawer-enter-active, .drawer-leave-active { transition: opacity var(--t-base); }
.drawer-enter-from, .drawer-leave-to       { opacity: 0; }
.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel        { transition: transform var(--t-base); }
.drawer-enter-from   .drawer__panel        { transform: translateX(100%); }
.drawer-leave-to     .drawer__panel        { transform: translateX(100%); }
</style>
