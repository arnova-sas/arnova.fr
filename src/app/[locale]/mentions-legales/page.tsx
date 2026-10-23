import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { LegalLayout, legalLinkClass } from '@/components/legal/legal-layout'
import { company, formattedAddress } from '@/config/company'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'
import { regionName } from '@/lib/region'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.legal' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/mentions-legales', locale),
        // A legal notice has no search value and should not compete with real pages.
        robots: { index: false, follow: true },
    }
}

export default async function LegalPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <LegalNotice />
}

function LegalNotice() {
    const t = useTranslations('Legal')
    const locale = useLocale()
    const external = (url: string) => (chunks: ReactNode) => (
        <a href={url} className={legalLinkClass} rel="noopener">
            {chunks}
        </a>
    )

    return (
        <LegalLayout
            current="notice"
            title={t('title')}
            lead={t('lead')}
            identity={{ id: 'editeur', title: t('identity.title'), content: <Identity /> }}
            sections={[
                {
                    id: 'hebergement',
                    title: t('hosting.title'),
                    content: (
                        <>
                            <p>
                                {t.rich('hosting.host', {
                                    name: company.host.name,
                                    address: company.host.address,
                                    country: regionName(company.host.countryCode, locale),
                                    url: company.host.url,
                                    link: external(company.host.url),
                                })}
                            </p>
                            <p>{t('hosting.cdn')}</p>
                            <p>
                                {t.rich('hosting.dns', {
                                    name: company.dnsProvider.name,
                                    link: external(company.dnsProvider.url),
                                })}
                            </p>
                        </>
                    ),
                },
                {
                    id: 'propriete-intellectuelle',
                    title: t('intellectualProperty.title'),
                    content: <p>{t('intellectualProperty.body', { company: company.name })}</p>,
                },
                {
                    id: 'responsabilite',
                    title: t('liability.title'),
                    content: <p>{t('liability.body', { company: company.name })}</p>,
                },
                {
                    id: 'donnees-personnelles',
                    title: t('data.title'),
                    content: (
                        <p>
                            {t.rich('data.body', {
                                privacy: (chunks) => (
                                    <Link href="/confidentialite" className={legalLinkClass}>
                                        {chunks}
                                    </Link>
                                ),
                                cookies: (chunks) => (
                                    <Link href="/cookies" className={legalLinkClass}>
                                        {chunks}
                                    </Link>
                                ),
                            })}
                        </p>
                    ),
                },
            ]}
        />
    )
}

/** Publisher identity — shown on the legal notice only, never repeated on the other legal pages. */
function Identity() {
    const t = useTranslations('Legal.identity')

    const tiles: { label: string; value: ReactNode; detail?: string; wide?: boolean; mono?: boolean }[] = [
        { label: t('nameLabel'), value: company.name, detail: t('formValue') },
        {
            label: t('directorLabel'),
            value: company.publicationDirector,
            detail: t('directorRole', { company: company.name }),
        },
        { label: t('addressLabel'), value: formattedAddress, wide: true },
        {
            label: t('rcsLabel'),
            value: t('rcsValue', { city: company.rcsCity, siren: company.siren }),
            detail: t('siretValue', { siret: company.siret }),
        },
        { label: t('vatLabel'), value: company.vat, mono: true },
        { label: t('capitalLabel'), value: company.capital },
        { label: t('apeLabel'), value: t('apeValue', { code: company.ape }) },
        {
            label: t('emailLabel'),
            value: (
                <a href={`mailto:${company.email}`} className={`${legalLinkClass} break-all`}>
                    {company.email}
                </a>
            ),
            wide: true,
        },
    ]

    return (
        <dl className="grid gap-3 sm:grid-cols-2">
            {tiles.map((tile) => (
                <div
                    key={tile.label}
                    className={`rounded-xl border border-border bg-background p-4 ${tile.wide ? 'sm:col-span-2' : ''}`}
                >
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{tile.label}</dt>
                    <dd
                        className={`mt-1.5 text-base font-semibold text-foreground ${tile.mono ? 'font-mono tracking-wide' : ''}`}
                    >
                        {tile.value}
                    </dd>
                    {tile.detail && <dd className="mt-0.5 text-sm text-muted">{tile.detail}</dd>}
                </div>
            ))}
        </dl>
    )
}
