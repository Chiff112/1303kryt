import { ref } from 'vue'

/**
 * useContent
 * ------------------------------------------------------------
 * A reusable composable that loads the site content (categories,
 * products, nav, etc.) from /data/content.json via fetch().
 *
 * Returns reactive references that any component can use:
 *   - data:    the parsed JSON object (or null while loading)
 *   - loading: true while the request is in flight
 *   - error:   error message if the request failed
 *   - load():  triggers the request (called automatically on first use)
 *
 * The data is cached at module scope, so multiple components
 * calling useContent() share a single request.
 */

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

export function useContent() {
  if (!data.value && !requestPromise) load()
  return { data, loading, error, load }
}
