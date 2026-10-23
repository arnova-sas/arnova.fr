import type { AppPathname } from '@/i18n/routing'

/**
 * The legal pages, in tab order. `updatedOn` is the date shown under each page
 * title: bump it whenever that page's wording changes.
 */
export const legalPages = [
    { key: 'notice', href: '/mentions-legales', updatedOn: '2026-10-23' },
    { key: 'privacy', href: '/confidentialite', updatedOn: '2026-10-23' },
    { key: 'cookies', href: '/cookies', updatedOn: '2026-10-23' },
] as const satisfies {
    key: string
    href: AppPathname
    updatedOn: string
}[]

export type LegalPageKey = (typeof legalPages)[number]['key']

export function legalUpdatedOn(key: LegalPageKey) {
    const page = legalPages.find((candidate) => candidate.key === key)!
    return new Date(`${page.updatedOn}T00:00:00Z`)
}
