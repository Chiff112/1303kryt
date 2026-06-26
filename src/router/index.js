import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import HomeView      from '../views/HomeView.vue'
import JuicesView    from '../views/JuicesView.vue'
import CartView      from '../views/CartView.vue'
import AccountView   from '../views/AccountView.vue'
import FranchiseView from '../views/FranchiseView.vue'

/**
 * Vue Router configuration.
 *
 * The whole site is a single-page app driven by these routes; the
 * header, footer and cart popup live in App.vue and stay mounted while
 * <RouterView> swaps the page.
 */
const routes = [
  { path: '/',          name: 'home',      component: HomeView,      meta: { title: 'Vita Juice' } },
  { path: '/juices',    name: 'juices',    component: JuicesView,    meta: { title: 'Соки — Vita Juice' } },
  { path: '/cart',      name: 'cart',      component: CartView,      meta: { title: 'Корзина — Vita Juice' } },
  { path: '/account',   name: 'account',   component: AccountView,   meta: { title: 'Личный кабинет — Vita Juice' } },
  { path: '/franchise', name: 'franchise', component: FranchiseView, meta: { title: 'Франшиза — Vita Juice' } },
  // Unknown paths fall back to the landing page
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // always start a new page at the top
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

// The personal area is only reachable when logged in; otherwise send
// the visitor to the landing page (where they can open the login modal).
router.beforeEach((to) => {
  if (to.path === '/account') {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) return { path: '/' }
  }
  return true
})

export default router
