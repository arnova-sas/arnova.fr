import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { buttonStyles } from '@/components/button-styles'
import { Container } from '@/components/container'
import { company } from '@/config/company'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.home' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/', locale),
        openGraph: { title: t('title'), description: t('description'), url: buildAlternates('/', locale).canonical },
    }
}

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return (
        <>
            <Hero />
            <Services />
            <Approach />
            <CompanyFacts />
            <CallToAction />
        </>
    )
}

function Hero() {
    const t = useTranslations('Home.hero')

    return (
        <section className="relative overflow-hidden border-b border-border">
            {/* Soft radial wash behind the headline; purely decorative. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,var(--accent-soft),transparent_70%)]"
            />
            <Container className="relative py-24 sm:py-32">
                <div className="max-w-3xl">
                    <p className="inline-flex rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                        {t('eyebrow')}
                    </p>
                    <h1 className="mt-8 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                        {t('title')}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t('lead')}</p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link href="/contact" className={buttonStyles.primary}>
                            {t('ctaPrimary')}
                        </Link>
                        <a href="#approche" className={buttonStyles.secondary}>
                            {t('ctaSecondary')}
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    )
}

function Services() {
    const t = useTranslations('Home.services')
    const items = ['marketing', 'publishing', 'monetization'] as const

    return (
        <section className="py-24">
            <Container>
                <SectionHeading title={t('title')} lead={t('lead')} />

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {items.map((item, index) => (
                        <article
                            key={item}
                            className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent"
                        >
                            <span className="font-display text-sm font-bold text-accent">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                                {t(`${item}.title`)}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{t(`${item}.body`)}</p>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    )
}

function Approach() {
    const t = useTranslations('Home.approach')
    const items = ['content', 'data', 'longTerm'] as const

    return (
        <section id="approche" className="scroll-mt-20 bg-surface-invert py-24 text-foreground-invert">
            <Container>
                <div className="max-w-2xl">
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-invert">{t('lead')}</p>
                </div>

                <dl className="mt-14 grid gap-10 md:grid-cols-3">
                    {items.map((item) => (
                        <div key={item} className="border-t border-border-invert pt-6">
                            <dt className="font-display text-lg font-bold">{t(`${item}.title`)}</dt>
                            <dd className="mt-3 text-sm leading-relaxed text-muted-invert">{t(`${item}.body`)}</dd>
                        </div>
                    ))}
                </dl>
            </Container>
        </section>
    )
}

function CompanyFacts() {
    const t = useTranslations('Home.company')

    const facts = [
        { label: t('formLabel'), value: t('formValue', { city: company.rcsCity }) },
        { label: t('apeLabel'), value: t('apeValue', { code: company.ape }) },
        { label: t('locationLabel'), value: t('locationValue', { city: company.address.city }) },
    ]

    return (
        <section className="py-24">
            <Container>
                <SectionHeading title={t('title')} lead={t('lead')} />

                <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                    {facts.map((fact) => (
                        <div key={fact.label} className="bg-background p-8">
                            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{fact.label}</dt>
                            <dd className="mt-3 text-base font-medium text-foreground">{fact.value}</dd>
                        </div>
                    ))}
                </dl>
            </Container>
        </section>
    )
}

function CallToAction() {
    const t = useTranslations('Home.cta')

    return (
        <section className="pb-8">
            <Container>
                <div className="rounded-3xl border border-border bg-accent-soft px-8 py-16 text-center">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t('title')}
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">{t('body')}</p>
                    <Link href="/contact" className={`${buttonStyles.primary} mt-8`}>
                        {t('button')}
                    </Link>
                </div>
            </Container>
        </section>
    )
}

function SectionHeading({ title, lead }: { title: string; lead: string }) {
    return (
        <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{lead}</p>
        </div>
    )
}
