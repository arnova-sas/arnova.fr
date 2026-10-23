import clsx from 'clsx'
import { useFormatter, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { Container } from '@/components/container'
import { Link } from '@/i18n/navigation'
import { type LegalPageKey, legalPages, legalUpdatedOn } from '@/lib/legal-pages'
import { LegalToc, type LegalTocItem } from './legal-toc'

/** Inline link inside legal prose; shared so every page looks the same. */
export const legalLinkClass =
    'font-medium text-accent underline decoration-1 underline-offset-4 transition-colors hover:text-accent-hover'

export type LegalSection = { id: string; title: string; content: ReactNode }

type LegalLayoutProps = {
    current: LegalPageKey
    title: string
    lead: ReactNode
    /** Unnumbered card shown before the sections — only the legal notice has one. */
    identity?: LegalSection
    sections: LegalSection[]
}

/**
 * Shared frame of the legal pages: breadcrumb, eyebrow, title, lead and
 * last-updated date, tabs between the legal documents, one numbered card per
 * section and a sticky "On this page" list with a scrollspy.
 */
export function LegalLayout({ current, title, lead, identity, sections }: LegalLayoutProps) {
    const t = useTranslations('LegalLayout')
    const tPages = useTranslations('LegalPages')
    const format = useFormatter()

    const numbered = sections.map((section, index) => ({ ...section, number: String(index + 1).padStart(2, '0') }))
    const tocItems: LegalTocItem[] = [
        ...(identity ? [{ id: identity.id, label: identity.title }] : []),
        ...numbered.map(({ id, title: label, number }) => ({ id, label, number })),
    ]

    return (
        <>
            <section className="relative overflow-hidden border-b border-border">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,var(--accent-soft),transparent_70%)]"
                />
                <Container className="relative pt-10 pb-12 sm:pt-12">
                    <nav aria-label={t('breadcrumbLabel')}>
                        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                            <li>
                                <Link href="/" className="transition-colors hover:text-accent">
                                    {t('home')}
                                </Link>
                            </li>
                            <Chevron />
                            <li>{t('eyebrow')}</li>
                            <Chevron />
                            <li aria-current="page" className="font-semibold text-foreground">
                                {tPages(current)}
                            </li>
                        </ol>
                    </nav>

                    <div className="mt-10 max-w-3xl">
                        <p className="inline-flex rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                            {t('eyebrow')}
                        </p>
                        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
                        <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted">
                            <ClockIcon />
                            {t('updatedOn', { date: format.dateTime(legalUpdatedOn(current), { dateStyle: 'long' }) })}
                        </p>
                    </div>

                    <nav
                        aria-label={t('tabsLabel')}
                        className="mt-10 flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-border bg-surface p-1.5"
                    >
                        {legalPages.map((page) => {
                            const isCurrent = page.key === current

                            return (
                                <Link
                                    key={page.key}
                                    href={page.href}
                                    aria-current={isCurrent ? 'page' : undefined}
                                    className={clsx(
                                        'rounded-xl px-4 py-2.5 text-sm transition-colors',
                                        isCurrent
                                            ? 'bg-accent font-semibold text-accent-foreground'
                                            : 'font-medium text-muted hover:bg-background hover:text-foreground'
                                    )}
                                >
                                    {tPages(page.key)}
                                </Link>
                            )
                        })}
                    </nav>
                </Container>
            </section>

            <Container className="py-12 sm:py-16">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
                    <aside className="lg:col-start-2 lg:row-start-1">
                        <div className="rounded-2xl border border-border bg-surface p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                            <p className="px-3 pt-1 pb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                                {t('tocTitle')}
                            </p>
                            <LegalToc items={tocItems} label={t('tocTitle')} />
                        </div>
                    </aside>

                    <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-1">
                        {identity && (
                            <LegalCard id={identity.id} title={identity.title} badge={<BuildingIcon />}>
                                {identity.content}
                            </LegalCard>
                        )}
                        {numbered.map((section) => (
                            <LegalCard key={section.id} id={section.id} title={section.title} badge={section.number}>
                                {section.content}
                            </LegalCard>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    )
}

function LegalCard({
    id,
    title,
    badge,
    children,
}: {
    id: string
    title: string
    badge: ReactNode
    children: ReactNode
}) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
            <h2
                id={`${id}-title`}
                className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-foreground"
            >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft font-display text-sm font-bold text-accent">
                    {badge}
                </span>
                {title}
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-muted">{children}</div>
        </section>
    )
}

/** Bulleted list for legal prose. */
export function LegalList({ children }: { children: ReactNode }) {
    return <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-accent">{children}</ul>
}

function Chevron() {
    return (
        <li aria-hidden="true" className="text-border">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
                <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </li>
    )
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className="size-3.5 text-accent"
        >
            <circle cx="8" cy="8" r="6.25" />
            <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function BuildingIcon() {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className="size-4"
        >
            <path d="M2 14h12M3.5 14V6.5L8 3l4.5 3.5V14M6 14v-3.5h4V14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** Label/value sheet, e.g. one processing's data, purpose, legal basis, recipients and retention. */
export function LegalFacts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
    return (
        <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
            {rows.map((row) => (
                <div key={row.label} className="grid gap-1 p-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{row.label}</dt>
                    <dd className="text-sm leading-relaxed text-foreground">{row.value}</dd>
                </div>
            ))}
        </dl>
    )
}
