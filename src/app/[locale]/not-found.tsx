import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buttonStyles } from '@/components/button-styles'
import { Container } from '@/components/container'
import { Link } from '@/i18n/navigation'

/**
 * Next resolves the not-found boundary's own metadata when it renders, so the
 * 404 gets its own title and description instead of the home page's. The locale
 * comes from the request, as set by the `[locale]` layout.
 */
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Metadata.notFound')

    return { title: t('title'), description: t('description') }
}

export default function NotFoundPage() {
    const t = useTranslations('NotFound')

    return (
        <Container className="flex flex-col items-start py-32">
            <p className="font-display text-6xl font-bold text-accent">404</p>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('title')}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{t('body')}</p>
            <Link href="/" className={`${buttonStyles.primary} mt-8`}>
                {t('cta')}
            </Link>
        </Container>
    )
}
