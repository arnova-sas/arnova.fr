import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { company } from '@/config/company'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })

type LayoutProps = {
    children: ReactNode
    params: Promise<{ locale: string }>
}

/** Pre-renders every locale at build time instead of on first request. */
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    const t = await getTranslations({ locale, namespace: 'Metadata' })

    return {
        metadataBase: new URL(company.siteUrl),
        title: { default: t('home.title'), template: t('titleTemplate') },
        description: t('home.description'),
        applicationName: t('siteName'),
        openGraph: {
            siteName: t('siteName'),
            type: 'website',
            locale,
        },
        // `opengraph-image.png` / `twitter-image.png` in `src/app/` are picked up by
        // the file convention; this only declares how X should frame them.
        twitter: { card: 'summary_large_image' },
        robots: { index: true, follow: true },
    }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
    const { locale } = await params
    // The `[locale]` segment catches unknown top-level paths too, so validate.
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    // Opts this subtree into static rendering rather than dynamic per-request work.
    setRequestLocale(locale)

    return (
        <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body className="flex min-h-screen flex-col font-sans antialiased">
                <NextIntlClientProvider>
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
