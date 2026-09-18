/**
 * Shared button appearance, exported as class strings rather than a component so
 * it can be applied to a `<Link>`, a `<button>` or an `<a>` without a polymorphic
 * wrapper. Keep visual changes here so every call site stays in sync.
 */
const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'

export const buttonStyles = {
    primary: `${base} bg-accent text-accent-foreground hover:bg-accent-hover`,
    secondary: `${base} border border-border bg-background text-foreground hover:border-accent hover:text-accent`,
    onDark: `${base} bg-background text-foreground hover:bg-accent hover:text-accent-foreground`,
} as const
