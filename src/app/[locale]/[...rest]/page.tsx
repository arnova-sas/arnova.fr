import { notFound } from 'next/navigation'

/**
 * Catches every unknown path under a locale so that `[locale]/not-found.tsx`
 * (localized copy, "Page not found" title) handles it, instead of Next's bare
 * English default 404.
 */
export default function CatchAllPage() {
    notFound()
}
