import clsx from 'clsx'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

/**
 * The emblem on its own.
 *
 * Two tints of the same artwork are shipped: the brand teal (#235964) drops to
 * roughly 1.6:1 against the dark-mode background, so a lighter variant is
 * swapped in. Tailwind's `dark:` variant keys off `prefers-color-scheme`, the
 * same signal `globals.css` uses, so the two can never disagree.
 */
export function LogoMark({ className }: { className?: string }) {
    const size = clsx('h-9 w-9', className)

    return (
        <>
            <Image
                src="/logo-mark.png"
                alt=""
                width={144}
                height={144}
                className={clsx(size, 'dark:hidden')}
                priority
            />
            <Image
                src="/logo-mark-dark.png"
                alt=""
                width={144}
                height={144}
                className={clsx(size, 'hidden dark:block')}
                priority
            />
        </>
    )
}

/** Emblem + wordmark, doubling as the home link in the header. */
export function Logo({ label }: { label: string }) {
    return (
        <Link
            href="/"
            aria-label={label}
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
            <LogoMark />
            <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground">ARNOVA</span>
        </Link>
    )
}
