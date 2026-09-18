import type { MetadataRoute } from 'next'
import { type AppPathname, routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

/** The legal notice is intentionally left out: it is served `noindex`. */
const INDEXABLE_PAGES: AppPathname[] = ['/', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
    return INDEXABLE_PAGES.map((href) => ({
        url: absoluteUrl(href, routing.defaultLocale),
        lastModified: new Date(),
        alternates: {
            languages: Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(href, locale)])),
        },
    }))
}
