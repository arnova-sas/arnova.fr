import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { LegalLayout, LegalList, legalLinkClass } from '@/components/legal/legal-layout'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'

/**
 * The only cookie the site sets: next-intl's locale cookie, written by the proxy
 * (`src/proxy.ts`) and by the locale switcher. next-intl 4 sets it without
 * `Max-Age`/`Expires`, so it is a session cookie.
 */
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

type PageProps = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Metadata.cookies' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: buildAlternates('/cookies', locale),
        robots: { index: false, follow: true },
    }
}

export default async function CookiesPage({ params }: PageProps) {
    const { locale } = await params
    setRequestLocale(locale)

    return <CookiesPolicy />
}

function CookiesPolicy() {
    const t = useTranslations('Cookies')
    const columns = ['name', 'party', 'purpose', 'lifetime', 'consent'] as const
    const cells: Record<(typeof columns)[number], ReactNode> = {
        name: <span className="font-mono font-semibold">{LOCALE_COOKIE_NAME}</span>,
        party: t('locale.party'),
        purpose: t('locale.purpose'),
        lifetime: t('locale.lifetime'),
        consent: (
            <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                {t('locale.consent')}
            </span>
        ),
    }

    return (
        <LegalLayout
            current="cookies"
            title={t('title')}
            lead={t('lead')}
            sections={[
                {
                    id: 'cookies-deposes',
                    title: t('list.title'),
                    content: (
                        <>
                            <p>{t('list.intro')}</p>
                            {/* Bleeds to the card edges. Below `md` each cookie becomes a stacked sheet instead of a
                                table too wide to read; only one of the two is ever displayed. */}
                            <dl className="-mx-6 divide-y divide-border border-y border-border bg-background sm:-mx-8 md:hidden">
                                {columns.map((column) => (
                                    <div key={column} className="grid gap-1 px-6 py-3 sm:px-8">
                                        <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                                            {t(`list.columns.${column}`)}
                                        </dt>
                                        <dd className="text-sm text-foreground">{cells[column]}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="-mx-6 hidden overflow-x-auto border-y border-border bg-background sm:-mx-8 md:block">
                                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                    <caption className="sr-only">{t('list.caption')}</caption>
                                    <thead>
                                        <tr className="border-b border-border">
                                            {columns.map((column) => (
                                                <th
                                                    key={column}
                                                    scope="col"
                                                    className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted first:pl-8 last:pr-8"
                                                >
                                                    {t(`list.columns.${column}`)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="align-top text-foreground">
                                            {columns.map((column) =>
                                                column === 'name' ? (
                                                    <th key={column} scope="row" className="py-4 pr-4 pl-8">
                                                        {cells[column]}
                                                    </th>
                                                ) : (
                                                    <td key={column} className="px-4 py-4 last:pr-8">
                                                        {cells[column]}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>{t('list.exemption')}</p>
                        </>
                    ),
                },
                {
                    id: 'aucun-traceur',
                    title: t('none.title'),
                    content: (
                        <>
                            <LegalList>
                                <li>{t('none.analytics')}</li>
                                <li>{t('none.ads')}</li>
                                <li>{t('none.thirdParty')}</li>
                                <li>{t('none.fonts')}</li>
                            </LegalList>
                            <p>{t('none.consequence')}</p>
                        </>
                    ),
                },
                {
                    id: 'gerer-les-cookies',
                    title: t('manage.title'),
                    content: (
                        <>
                            <p>{t('manage.body')}</p>
                            <p>
                                {t.rich('manage.privacy', {
                                    link: (chunks) => (
                                        <Link href="/confidentialite" className={legalLinkClass}>
                                            {chunks}
                                        </Link>
                                    ),
                                })}
                            </p>
                        </>
                    ),
                },
            ]}
        />
    )
}
