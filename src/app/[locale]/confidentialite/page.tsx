import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { LegalFacts, LegalLayout, LegalList, legalLinkClass } from '@/components/legal/legal-layout'
import { company, formattedAddress } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'
import { regionName } from '@/lib/region'

const CNIL_COMPLAINT_URL = 'https://www.cnil.fr/fr/plaintes'

/** GDPR rights listed in the "Your rights" section, in the order of articles 15 to 22. */
const RIGHTS = [
    'access',
    'rectification',
    'erasure',
    'restriction',
    'objection',
    'portability',
    'postMortem',
    'withdrawal',
] as const

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.privacy' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/confidentialite', locale),
        // Same policy as the legal notice: useful to visitors, no search value.
        robots: { index: false, follow: true },
    }
}

export default async function PrivacyPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <PrivacyPolicy />
}

function PrivacyPolicy() {
    const t = useTranslations('Privacy')
    const locale = useLocale()
    const external = (url: string) => (chunks: ReactNode) => (
        <a href={url} className={legalLinkClass} rel="noopener">
            {chunks}
        </a>
    )
    const mail = (chunks: ReactNode) => (
        <a href={`mailto:${company.email}`} className={`${legalLinkClass} break-all`}>
            {chunks}
        </a>
    )
    const strong = (chunks: ReactNode) => <strong className="font-semibold text-foreground">{chunks}</strong>

    return (
        <LegalLayout
            current="privacy"
            title={t('title')}
            lead={t('lead')}
            sections={[
                {
                    id: 'responsable',
                    title: t('controller.title'),
                    content: (
                        <p>
                            {t.rich('controller.body', {
                                company: company.name,
                                legalForm: company.legalForm,
                                address: formattedAddress,
                                email: company.email,
                                mail,
                            })}
                        </p>
                    ),
                },
                {
                    id: 'formulaire-de-contact',
                    title: t('contactForm.title'),
                    content: (
                        <>
                            <p>{t('contactForm.intro')}</p>
                            <LegalFacts
                                rows={[
                                    { label: t('labels.data'), value: t('contactForm.data') },
                                    { label: t('labels.purpose'), value: t('contactForm.purpose') },
                                    { label: t('labels.legalBasis'), value: t('contactForm.legalBasis') },
                                    {
                                        label: t('labels.recipients'),
                                        value: t.rich('contactForm.recipients', {
                                            form: company.formProcessor.name,
                                            operator: company.formProcessor.operator,
                                            country: regionName(company.formProcessor.countryCode, locale),
                                            mailProvider: company.mailProvider.name,
                                            mailService: company.mailProvider.service,
                                            strong,
                                        }),
                                    },
                                    {
                                        label: t('labels.retention'),
                                        value: t.rich('contactForm.retention', {
                                            form: company.formProcessor.name,
                                            link: external(company.formProcessor.privacyUrl),
                                        }),
                                    },
                                ]}
                            />
                        </>
                    ),
                },
                {
                    id: 'journaux-hebergement',
                    title: t('hostingLogs.title', { host: company.host.name }),
                    content: (
                        <>
                            <p>{t('hostingLogs.intro', { host: company.host.name })}</p>
                            <LegalFacts
                                rows={[
                                    { label: t('labels.data'), value: t('hostingLogs.data') },
                                    { label: t('labels.purpose'), value: t('hostingLogs.purpose') },
                                    { label: t('labels.legalBasis'), value: t('hostingLogs.legalBasis') },
                                    {
                                        label: t('labels.recipients'),
                                        value: t('hostingLogs.recipients', { host: company.host.name }),
                                    },
                                    {
                                        label: t('labels.retention'),
                                        value: t.rich('hostingLogs.retention', {
                                            host: company.host.name,
                                            link: external(company.host.privacyUrl),
                                        }),
                                    },
                                ]}
                            />
                        </>
                    ),
                },
                {
                    id: 'transferts',
                    title: t('transfers.title'),
                    content: (
                        <>
                            <p>
                                {t('transfers.us', {
                                    host: company.host.name,
                                    mailProvider: company.mailProvider.name,
                                })}
                            </p>
                            <p>
                                {t('transfers.form', {
                                    form: company.formProcessor.name,
                                    operator: company.formProcessor.operator,
                                    country: regionName(company.formProcessor.countryCode, locale),
                                })}
                            </p>
                        </>
                    ),
                },
                {
                    id: 'pas-de-vente',
                    title: t('noSale.title', { company: company.name }),
                    content: <p>{t('noSale.body', { company: company.name })}</p>,
                },
                {
                    id: 'vos-droits',
                    title: t('rights.title'),
                    content: (
                        <>
                            <p>{t('rights.intro')}</p>
                            <LegalList>
                                {RIGHTS.map((right) => (
                                    <li key={right}>{t.rich(`rights.items.${right}`, { strong })}</li>
                                ))}
                            </LegalList>
                            <p>{t.rich('rights.exercise', { email: company.email, mail })}</p>
                        </>
                    ),
                },
                {
                    id: 'reclamation',
                    title: t('complaint.title'),
                    content: <p>{t.rich('complaint.body', { link: external(CNIL_COMPLAINT_URL) })}</p>,
                },
                {
                    id: 'securite',
                    title: t('security.title'),
                    content: (
                        <>
                            <p>{t('security.measures')}</p>
                            <p>{t('security.breach', { company: company.name })}</p>
                        </>
                    ),
                },
            ]}
        />
    )
}
