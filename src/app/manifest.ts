import type { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { themeColor } from '@/lib/metadata'

/** Web app manifest (`/manifest.webmanifest`), in the default locale: browsers read a single one per site. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'Metadata' })

    return {
        name: t('siteName'),
        short_name: t('siteName'),
        description: t('home.description'),
        lang: routing.defaultLocale,
        start_url: '/',
        display: 'browser',
        background_color: themeColor[0].color,
        theme_color: themeColor[0].color,
        icons: [
            { src: '/icon.png', sizes: '256x256', type: 'image/png' },
            { src: '/logo.png', sizes: '512x512', type: 'image/png' },
            { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    }
}
