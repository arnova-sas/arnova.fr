import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

/**
 * Resolves the active locale and loads its messages once per request.
 *
 * Note: `requestLocale` is marked deprecated by next-intl in favour of
 * `next/root-params`, but that API is still behind `experimental.rootParams`
 * in Next.js 16.3, so we stay on the stable path here.
 */
export default getRequestConfig(async ({ requestLocale }) => {
    // The `[locale]` segment acts as a catch-all, so the value can be missing
    // or bogus (e.g. a request for `/unknown.txt`). Always validate it.
    const requested = await requestLocale
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    }
})
