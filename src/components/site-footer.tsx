import { useTranslations } from 'next-intl'
import { company, formattedAddress } from '@/config/company'
import { Link } from '@/i18n/navigation'
import { Container } from './container'
import { LogoMark } from './logo'

/**
 * `py-1` lifts each link to a 28px tap target (WCAG 2.5.8 asks for 24px); the
 * nav's `gap-1` and `-my-1` absorb that padding so the visual rhythm is unchanged.
 */
const linkClass = 'py-1 text-muted transition-colors hover:text-accent'

export function SiteFooter() {
    const t = useTranslations('Footer')
    const tNav = useTranslations('Nav')

    return (
        <footer className="mt-24 border-t border-border bg-surface">
            <Container className="flex flex-col gap-10 py-14">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2.5">
                            <LogoMark className="h-8 w-8" />
                            <p className="font-display text-lg font-bold tracking-[0.18em] text-foreground">
                                {company.name}
                            </p>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{t('tagline')}</p>
                    </div>

                    <nav aria-label={t('navLabel')} className="-my-1 flex flex-col gap-1 text-sm">
                        <Link href="/" className={linkClass}>
                            {tNav('home')}
                        </Link>
                        <Link href="/contact" className={linkClass}>
                            {tNav('contact')}
                        </Link>
                        <Link href="/mentions-legales" className={linkClass}>
                            {tNav('legal')}
                        </Link>
                        <Link href="/confidentialite" className={linkClass}>
                            {tNav('privacy')}
                        </Link>
                        <Link href="/cookies" className={linkClass}>
                            {tNav('cookies')}
                        </Link>
                        <a href={`mailto:${company.email}`} className={linkClass}>
                            {company.email}
                        </a>
                        <a href={company.linkedinUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
                            {t('linkedinLabel')}
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
