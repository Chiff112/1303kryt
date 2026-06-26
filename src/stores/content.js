import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Content store (Pinia).
 *
 * Loads all site content — categories, products, navigation, delivery,
 * loyalty, account history, franchise copy, … — from the JSON file
 * /public/data/content.json via a single fetch() request.
 *
 * The request is fired once (on first store use) and shared by every
 * component, so the whole site is driven by one data source.
 */
export const useContentStore = defineStore('content', () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let requestPromise = null

  async function load() {
    if (data.value || requestPromise) return requestPromise
    loading.value = true
    error.value = null
    requestPromise = fetch('/data/content.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        data.value = json
        return json
      })
      .catch((err) => {
        error.value = err.message
        console.error('Failed to load content.json:', err)
      })
      .finally(() => {
        loading.value = false
      })
    return requestPromise
  }

  // kick off the request as soon as the store is first used
  load()

  return { data, loading, error, load }
})
