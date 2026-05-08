type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

const isDevelopment = import.meta.env.DEV

export const trackEvent = (
  eventName: string,
  payload?: AnalyticsPayload,
): void => {
  if (isDevelopment) {
    console.log('[analytics]', eventName, payload ?? {})
  }
}
