'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

export type LegalTocItem = { id: string; label: string; number?: string }

/**
 * "On this page" list with a scrollspy: the link of the section currently being
 * read is highlighted. A section counts as current once its top passes the band
 * just under the sticky header; plain anchors keep it working without JavaScript.
 */
export function LegalToc({ items, label }: { items: LegalTocItem[]; label: string }) {
    const [activeId, setActiveId] = useState(items[0]?.id)

    useEffect(() => {
        const sections = items
            .map((item) => document.getElementById(item.id))
            .filter((element): element is HTMLElement => element !== null)
        if (sections.length === 0) return

        const visible = new Set<string>()
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.add(entry.target.id)
                    else visible.delete(entry.target.id)
                }
                // First section (in document order) inside the reading band wins.
                const current = sections.find((section) => visible.has(section.id))
                if (current) setActiveId(current.id)
            },
            // Top offset clears the 64px sticky header; the band covers the upper part of the viewport.
            { rootMargin: '-96px 0px -55% 0px' }
        )

        for (const section of sections) observer.observe(section)
        return () => observer.disconnect()
    }, [items])

    return (
        <nav aria-label={label}>
            <ol className="flex flex-col gap-1">
                {items.map((item) => {
                    const isActive = item.id === activeId

                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                aria-current={isActive ? 'location' : undefined}
                                className={clsx(
                                    'flex items-baseline gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors',
                                    isActive
                                        ? 'border-accent bg-background font-semibold text-foreground'
                                        : 'border-transparent text-muted hover:bg-background hover:text-foreground'
                                )}
                            >
                                {item.number && (
                                    <span className="font-display text-xs font-bold text-accent">{item.number}</span>
                                )}
                                <span>{item.label}</span>
                            </a>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
