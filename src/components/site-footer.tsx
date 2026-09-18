import { useTranslations } from 'next-intl'
import { company, formattedAddress } from '@/config/company'
import { Link } from '@/i18n/navigation'
import { Container } from './container'

export function SiteFooter() {
    const t = useTranslations('Footer')
    const tNav = useTranslations('Nav')

    return (
        <footer className="mt-24 border-t border-border bg-surface">
            <Container className="flex flex-col gap-10 py-14">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-sm">
                        <p className="font-display text-lg font-bold tracking-[0.18em] text-foreground">ARNOVA</p>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{t('tagline')}</p>
                    </div>

                    <nav aria-label={t('navLabel')} className="flex flex-col gap-3 text-sm">
                        <Link href="/" className="text-muted transition-colors hover:text-accent">
                            {tNav('home')}
                        </Link>
                        <Link href="/contact" className="text-muted transition-colors hover:text-accent">
                            {tNav('contact')}
                        </Link>
                        <Link href="/mentions-legales" className="text-muted transition-colors hover:text-accent">
                            {tNav('legal')}
                        </Link>
                        <a href={`mailto:${company.email}`} className="text-muted transition-colors hover:text-accent">
                            {company.email}
                        </a>
                    </nav>
                </div>

                <div className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted">
                    <p>
                        {company.name} — {company.legalForm} · SIREN {company.siren} · {formattedAddress}
                    </p>
                    <p>
                        © {new Date().getFullYear()} {company.name}. {t('rights')}
                    </p>
                </div>
            </Container>
        </footer>
    )
}
