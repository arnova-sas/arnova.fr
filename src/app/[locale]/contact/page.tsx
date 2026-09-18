import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/contact-form'
import { Container } from '@/components/container'
import { company, formattedAddress } from '@/config/company'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.contact' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/contact', locale),
    }
}

export default async function ContactPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <Container className="py-20 sm:py-28">
            <ContactIntro />

            <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
                <ContactForm accessKey={process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY} fallbackEmail={company.email} />
                <ContactDetails />
            </div>
        </Container>
    )
}

function ContactIntro() {
    const t = useTranslations('Contact')

    return (
        <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t('title')}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t('lead')}</p>
        </div>
    )
}

function ContactDetails() {
    const t = useTranslations('Contact.aside')

    return (
        <aside className="h-fit rounded-2xl border border-border bg-surface p-8">
            <h2 className="font-display text-lg font-bold text-foreground">{t('title')}</h2>

            <dl className="mt-6 flex flex-col gap-6 text-sm">
                <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{t('emailLabel')}</dt>
                    <dd className="mt-2">
                        <a
                            href={`mailto:${company.email}`}
                            className="text-foreground underline-offset-4 hover:text-accent hover:underline"
                        >
                            {company.email}
                        </a>
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{t('addressLabel')}</dt>
                    <dd className="mt-2 leading-relaxed text-foreground">{formattedAddress}</dd>
                </div>
                <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{t('responseLabel')}</dt>
                    <dd className="mt-2 leading-relaxed text-foreground">{t('responseValue')}</dd>
                </div>
            </dl>
        </aside>
    )
}
