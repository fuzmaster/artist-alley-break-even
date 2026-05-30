/**
 * Analytics — wraps Plausible in production, logs to console in dev.
 *
 * Setup (one-time):
 *   1. Create a free site at https://plausible.io
 *   2. Add VITE_PLAUSIBLE_DOMAIN=yourdomain.com to Vercel → Settings → Environment Variables
 *   3. Redeploy — the script tag is injected automatically at runtime
 *
 * No env var set → analytics is silently disabled. Safe for local dev.
 */

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void
  }
}

const isDevelopment = import.meta.env.DEV
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

// Inject the Plausible script once when this module is first imported.
if (!isDevelopment && plausibleDomain) {
  const script = document.createElement('script')
  script.defer = true
  script.dataset['domain'] = plausibleDomain
  script.src = 'https://plausible.io/js/script.tagged-events.js'
  document.head.appendChild(script)
}

export const trackEvent = (eventName: string, payload?: AnalyticsPayload): void => {
  if (isDevelopment) {
    console.log('[analytics]', eventName, payload ?? {})
    return
  }

  if (typeof window.plausible === 'function') {
    // Plausible props only accept string | number | boolean — filter nullish values
    const props = payload
      ? Object.fromEntries(
          Object.entries(payload).filter(
            (entry): entry is [string, string | number | boolean] =>
              entry[1] !== null && entry[1] !== undefined,
          ),
        )
      : undefined

    window.plausible(eventName, props ? { props } : undefined)
  }
}
