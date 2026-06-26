import { defineStore } from 'pinia'
import { ref } from 'vue'

// Хранилище контента. Один раз загружает весь текст и список товаров
// из файла /public/data/content.json и раздаёт их всем компонентам.
export const useContentStore = defineStore('content', () => {
  const data = ref(null)   // сюда попадёт содержимое JSON-файла
  let request = null       // запоминаем запрос, чтобы не грузить дважды

  async function load() {
    if (data.value || request) return request
    request = fetch('/data/content.json')
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => console.error('Не удалось загрузить content.json:', err))
    return request
  }

  load() // запускаем загрузку сразу при первом обращении к стору
  return { data, load }
})
