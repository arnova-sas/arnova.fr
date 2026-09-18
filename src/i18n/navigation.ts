import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Locale-aware replacements for `next/link` and `next/navigation`.
 * Always import `Link`, `redirect`, `usePathname` and `useRouter` from here so
 * the locale prefix and the localized pathnames are applied automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
