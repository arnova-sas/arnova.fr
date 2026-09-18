import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

/**
 * Negotiates the locale (cookie -> Accept-Language -> default) and rewrites the
 * request onto the matching `[locale]` segment, resolving localized pathnames
 * such as `/en/legal-notice` -> `/en/mentions-legales` along the way.
 *
 * Next.js 16.3 renamed the `middleware` file convention to `proxy`; the export
 * signature is unchanged, so next-intl's factory still applies directly.
 */
export default createMiddleware(routing)

export const config = {
    // Skip API routes, Next.js and Vercel internals, and any file with an extension.
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
