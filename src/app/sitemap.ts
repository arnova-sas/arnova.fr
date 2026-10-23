import type { MetadataRoute } from 'next'
import { type AppPathname, routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/metadata'

/**
 * Indexable pages and the date their content last changed. Bump a date when that
 * page's copy changes: a build-time `new Date()` would tell crawlers every page
 * changed on every deploy. The legal pages are left out: they are served `noindex`.
 */
const INDEXABLE_PAGES: { href: AppPathname; lastModified: string }[] = [
    { href: '/', lastModified: '2026-10-23' },
    { href: '/contact', lastModified: '2026-10-23' },
]

export default function sitemap(): MetadataRoute.Sitemap {
    return INDEXABLE_PAGES.map(({ href, lastModified }) => ({
        url: absoluteUrl(href, routing.defaultLocale),
        lastModified,
        alternates: {
            languages: Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(href, locale)])),
        },
    }))
}
