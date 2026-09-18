import type { Metadata } from 'next'
import { useFormatter, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { Container } from '@/components/container'
import { company, formattedAddress } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

/** Bump this whenever the wording below changes. */
const LEGAL_UPDATED_ON = new Date('2026-09-18T00:00:00Z')

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

    return (
        <Container className="py-20 sm:py-28">
            <LegalContent />
        </Container>
    )
}

function LegalContent() {
    const t = useTranslations('Legal')
    const format = useFormatter()

    return (
        <article className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t('title')}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t('lead')}</p>
            <p className="mt-2 text-sm text-muted">
                {t('updatedOn', { date: format.dateTime(LEGAL_UPDATED_ON, { dateStyle: 'long' }) })}
            </p>

            <Editor />

            <Section title={t('director.title')}>
                <p>{t('director.body', { name: company.publicationDirector, company: company.name })}</p>
            </Section>

            <Section title={t('host.title')}>
                <p>
                    {t('host.body', {
                        name: company.host.name,
                        address: company.host.address,
                        country: company.host.country,
                        url: company.host.url,
                    })}
                </p>
            </Section>

            <Section title={t('intellectualProperty.title')}>
                <p>{t('intellectualProperty.body', { company: company.name })}</p>
            </Section>

            <Section title={t('personalData.title')}>
                <p>{t('personalData.body')}</p>
                <p>{t('personalData.processor')}</p>
                <p>{t('personalData.retention')}</p>
                <p>{t('personalData.rights', { email: company.email })}</p>
            </Section>

            <Section title={t('cookies.title')}>
                <p>{t('cookies.body')}</p>
            </Section>

            <Section title={t('liability.title')}>
                <p>{t('liability.body', { company: company.name })}</p>
            </Section>
        </article>
    )
}

function Editor() {
    const t = useTranslations('Legal.editor')

    const rows = [
        { label: t('nameLabel'), value: company.name },
        { label: t('formLabel'), value: t('formValue') },
        { label: t('capitalLabel'), value: company.capital },
        { label: t('addressLabel'), value: formattedAddress },
        { label: t('rcsLabel'), value: t('rcsValue', { city: company.rcsCity, siren: company.siren }) },
        { label: t('siretLabel'), value: company.siret },
        { label: t('vatLabel'), value: company.vat },
        { label: t('apeLabel'), value: t('apeValue', { code: company.ape }) },
    ]

    return (
        <Section title={t('title')}>
            <dl className="not-prose grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {rows.map((row) => (
                    <div key={row.label} className="grid gap-1 bg-background p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
                        <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{row.label}</dt>
                        <dd className="text-sm text-foreground">{row.value}</dd>
                    </div>
                ))}
                <div className="grid gap-1 bg-background p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{t('emailLabel')}</dt>
                    <dd className="text-sm">
                        <a
                            href={`mailto:${company.email}`}
                            className="text-foreground underline-offset-4 hover:text-accent hover:underline"
                        >
                            {company.email}
                        </a>
                    </dd>
                </div>
            </dl>
        </Section>
    )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mt-12">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">{title}</h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted">{children}</div>
        </section>
    )
}
