import type { Metadata, Viewport } from 'next'
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

/**
 * Link-preview card (`public/og-image.png`, 1200×630) for Open Graph and X alike.
 *
 * Declared here rather than through the `opengraph-image` file convention: that file
 * sat in `src/app/`, above the `[locale]` root layout, and Next merges metadata
 * shallowly, so the layout's own `openGraph` replaced it and no page had an image.
 */
export const socialImage = { url: '/og-image.png', width: 1200, height: 630 }

/**
 * The `openGraph` block every page starts from. A page that sets `openGraph`
 * replaces the layout's whole object, so it spreads this one back in.
 */
export function baseOpenGraph(locale: Locale, siteName: string): NonNullable<Metadata['openGraph']> {
    return { siteName, type: 'website', locale, images: [{ ...socialImage, alt: siteName }] }
}

/**
 * Browser UI colour, one per scheme: `--background` from `globals.css`, so the
 * address bar blends into the header. Keep both in step with the tokens.
 */
export const themeColor = [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#06151a' },
] satisfies Viewport['themeColor']
