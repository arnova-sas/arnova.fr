export type ContactFormValues = {
    name: string
    email: string
    message: string
}

/**
 * Validation failures are returned as *codes*, not sentences, so the form stays
 * locale-agnostic: the component looks each code up in `messages/{locale}.json`
 * under `Contact.errors`. Add a code here and you must add its translation in
 * both `fr.json` and `en.json`.
 */
export type ContactFieldError = 'required' | 'invalidEmail' | 'tooShort'

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, ContactFieldError>>

/** Deliberately permissive: catches typos, not exotic-but-valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Client-side gate before a submission is sent to Web3Forms.
 *
 * TODO(arnova): tune the anti-spam / message-quality policy below.
 *
 * This is a genuine trade-off, not boilerplate — every rule you add filters
 * junk but also turns away real prospects:
 *   - `MIN_MESSAGE_LENGTH` at 10 lets "Call me back" through; at 80 it forces a
 *     real brief but loses the visitor who just wants a quick reply.
 *   - You could require a minimum word count instead of a character count, so
 *     "aaaaaaaaaaaaaaaa" does not pass.
 *   - You could reject messages containing URLs (classic SEO-spam signature),
 *     at the cost of prospects who legitimately want to link to their site —
 *     which, for a company that buys and operates websites, is common.
 *
 * Web3Forms already runs its own spam filtering plus the hidden `botcheck`
 * honeypot, so this layer is about message *quality*, not bot defence.
 */
const MIN_MESSAGE_LENGTH = 10

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
    const errors: ContactFormErrors = {}

    if (!values.name) {
        errors.name = 'required'
    }

    if (!values.email) {
        errors.email = 'required'
    } else if (!EMAIL_PATTERN.test(values.email)) {
        errors.email = 'invalidEmail'
    }

    if (!values.message) {
        errors.message = 'required'
    } else if (values.message.length < MIN_MESSAGE_LENGTH) {
        errors.message = 'tooShort'
    }

    return errors
}
