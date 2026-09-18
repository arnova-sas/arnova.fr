'use client'

import clsx from 'clsx'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

/**
 * Switches locale while staying on the current page. `usePathname()` from
 * `@/i18n/navigation` returns the *internal* pathname (e.g. `/mentions-legales`),
 * so handing it back to `<Link locale="en">` resolves to `/en/legal-notice`.
 */
export function LocaleSwitcher({ label }: { label: string }) {
    const pathname = usePathname()
    const activeLocale = useLocale()

    return (
        <nav aria-label={label} className="flex items-center gap-0.5 rounded-full border border-border p-0.5">
            {routing.locales.map((locale) => {
                const isActive = locale === activeLocale

                return (
                    <Link
                        key={locale}
                        href={pathname}
                        locale={locale}
                        hrefLang={locale}
                        aria-current={isActive ? 'true' : undefined}
                        className={clsx(
                            'rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors',
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-foreground'
                        )}
                    >
                        {locale}
                    </Link>
                )
            })}
        </nav>
    )
}
