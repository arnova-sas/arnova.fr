import { company } from '@/config/company'
import { getPathname } from '@/i18n/navigation'
import { type AppPathname, type Locale, routing } from '@/i18n/routing'

export function absoluteUrl(href: AppPathname, locale: Locale) {
    return new URL(getPathname({ href, locale }), company.siteUrl).toString()
}

/**
 * Canonical + hreflang block for a page. Search engines need every locale of a
 * page to point at each other, and `x-default` to name the version served when
 * no language matches — here, French.
 */
export function buildAlternates(href: AppPathname, locale: Locale) {
    return {
        canonical: absoluteUrl(href, locale),
        languages: {
            ...Object.fromEntries(routing.locales.map((candidate) => [candidate, absoluteUrl(href, candidate)])),
            'x-default': absoluteUrl(href, routing.defaultLocale),
        },
    }
}
