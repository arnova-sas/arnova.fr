import type messages from './messages/fr.json'
import type { routing } from './src/i18n/routing'

/**
 * Makes translation keys and locales type-safe across the app: `t('Nav.contact')`
 * autocompletes, and a typo fails `yarn typecheck`. French is the reference
 * catalogue — `messages/en.json` must mirror its shape.
 */
declare module 'next-intl' {
    interface AppConfig {
        Locale: (typeof routing.locales)[number]
        Messages: typeof messages
    }
}
