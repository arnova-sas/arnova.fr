import { Link } from '@/i18n/navigation'

/**
 * Wordmark + "nova" burst mark. Doubles as the home link in the header.
 */
export function Logo({ label }: { label: string }) {
    return (
        <Link
            href="/"
            aria-label={label}
            className="group inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-accent">
                <path
                    fill="currentColor"
                    d="M12 0.5 14.2 8.1 21.5 5.2 16.9 11.6 24 14.4l-7.6 0.9 3 7.2-6.4-4.5-4.2 6.5-0.6-7.7-7.7 1.4 5.9-5L0 8.9l7.6 1.3z"
                />
            </svg>
            <span className="font-display text-lg font-bold tracking-[0.18em]">ARNOVA</span>
        </Link>
    )
}
