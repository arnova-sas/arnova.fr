import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { buttonStyles } from './button-styles'
import { Container } from './container'
import { LocaleSwitcher } from './locale-switcher'
import { Logo } from './logo'

export function SiteHeader() {
    const t = useTranslations('Nav')

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Logo label={t('home')} />

                <div className="flex items-center gap-3">
                    <LocaleSwitcher label={t('languageSwitcher')} />
                    {/* Slightly tighter than the page-level CTAs so it fits the 64px bar. */}
                    <Link href="/contact" className={`${buttonStyles.primary} px-4 py-2 text-xs sm:text-sm`}>
                        {t('contact')}
                    </Link>
                </div>
            </Container>
        </header>
    )
}
