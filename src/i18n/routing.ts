import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    /**
     * French is the default and gets clean URLs (arnova.fr/contact); English is
     * always prefixed (arnova.fr/en/contact). The company is French-registered,
     * so the unprefixed canonical URLs belong to the French version.
     */
    localePrefix: 'as-needed',
    /**
     * Internal path -> per-locale public path. The keys are what you pass to
     * `<Link href="...">`; the values are what visitors see in the address bar.
     * The folder name under `src/app/[locale]/` must match the *key*.
     */
    pathnames: {
        '/': '/',
        '/contact': '/contact',
        '/mentions-legales': {
            fr: '/mentions-legales',
            en: '/legal-notice',
        },
    },
})

export type Locale = (typeof routing.locales)[number]
export type AppPathname = keyof typeof routing.pathnames
