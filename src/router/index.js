// Настройка маршрутов (адресов страниц) сайта.
// Шапка, подвал и всплывающая корзина живут в App.vue и не пропадают,
// а <RouterView> просто меняет содержимое страницы.
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import HomeView      from '../views/HomeView.vue'
import JuicesView    from '../views/JuicesView.vue'
import CartView      from '../views/CartView.vue'
import AccountView   from '../views/AccountView.vue'
import FranchiseView from '../views/FranchiseView.vue'

// Список страниц: адрес -> компонент. title — заголовок вкладки браузера.
const routes = [
  { path: '/',          component: HomeView,      meta: { title: 'Vita Juice' } },
  { path: '/juices',    component: JuicesView,    meta: { title: 'Соки — Vita Juice' } },
  { path: '/cart',      component: CartView,      meta: { title: 'Корзина — Vita Juice' } },
  { path: '/account',   component: AccountView,   meta: { title: 'Личный кабинет — Vita Juice' } },
  { path: '/franchise', component: FranchiseView, meta: { title: 'Франшиза — Vita Juice' } },
  // Неизвестный адрес — возвращаем на главную.
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // При переходе всегда прокручиваем страницу наверх.
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' })
})

// Меняем заголовок вкладки при переходе.
router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

// В личный кабинет пускаем только тех, кто вошёл. Остальных — на главную.
router.beforeEach((to) => {
  if (to.path === '/account' && !useAuthStore().isLoggedIn) return { path: '/' }
  return true
})

export default router
