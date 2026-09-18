'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { type FormEvent, useId, useState } from 'react'
import { type ContactFormErrors, type ContactFormValues, validateContactForm } from '@/lib/contact-form'
import { buttonStyles } from './button-styles'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Posts straight to Web3Forms from the browser — no API route, no server secret.
 * The access key only authorises delivery to the single inbox it was issued for,
 * which is why it is safe as a `NEXT_PUBLIC_` value.
 */
export function ContactForm({ accessKey, fallbackEmail }: { accessKey?: string; fallbackEmail: string }) {
    const t = useTranslations('Contact')
    const fieldId = useId()
    const [status, setStatus] = useState<Status>('idle')
    const [errors, setErrors] = useState<ContactFormErrors>({})

    // Without a key the form could never deliver anything; show a mailto instead
    // of a button that silently fails.
    if (!accessKey) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
                <p>{t('unconfigured')}</p>
                <a href={`mailto:${fallbackEmail}`} className={`${buttonStyles.primary} mt-4`}>
                    {fallbackEmail}
                </a>
            </div>
        )
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const data = new FormData(form)
        const values: ContactFormValues = {
            name: String(data.get('name') ?? '').trim(),
            email: String(data.get('email') ?? '').trim(),
            message: String(data.get('message') ?? '').trim(),
        }

        const validationErrors = validateContactForm(values)
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) {
            setStatus('idle')
            return
        }

        setStatus('submitting')

        try {
            const response = await fetch(WEB3FORMS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: accessKey,
                    subject: t('emailSubject', { name: values.name }),
                    from_name: 'arnova.fr',
                    // Hidden honeypot: real users never tick it, bots that fill
                    // every field do — Web3Forms then drops the submission.
                    botcheck: data.get('botcheck') !== null,
                    ...values,
                }),
            })

            const result: { success?: boolean; message?: string } = await response.json()
            if (!response.ok || !result.success) {
                throw new Error(result.message ?? 'Web3Forms rejected the submission')
            }

            form.reset()
            setStatus('success')
        } catch {
            setStatus('error')
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <Field
                id={`${fieldId}-name`}
                name="name"
                label={t('fields.name')}
                autoComplete="name"
                error={errors.name && t(`errors.${errors.name}`)}
            />
            <Field
                id={`${fieldId}-email`}
                name="email"
                type="email"
                label={t('fields.email')}
                autoComplete="email"
                error={errors.email && t(`errors.${errors.email}`)}
            />
            <Field
                id={`${fieldId}-message`}
                name="message"
                label={t('fields.message')}
                multiline
                error={errors.message && t(`errors.${errors.message}`)}
            />

            <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={status === 'submitting'} className={buttonStyles.primary}>
                    {status === 'submitting' ? t('submitting') : t('submit')}
                </button>

                {status === 'success' && (
                    <p role="status" className="text-sm font-medium text-accent">
                        {t('success')}
                    </p>
                )}
                {status === 'error' && (
                    <p role="alert" className="text-sm font-medium text-highlight">
                        {t('error', { email: fallbackEmail })}
                    </p>
                )}
            </div>

            <p className="text-xs leading-relaxed text-muted">{t('privacyNotice')}</p>
        </form>
    )
}

type FieldProps = {
    id: string
    name: string
    label: string
    error?: string
    type?: string
    autoComplete?: string
    multiline?: boolean
}

function Field({ id, name, label, error, type = 'text', autoComplete, multiline = false }: FieldProps) {
    const errorId = `${id}-error`
    const className = clsx(
        'w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted',
        error ? 'border-highlight' : 'border-border focus:border-accent'
    )

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </label>

            {multiline ? (
                <textarea
                    id={id}
                    name={name}
                    rows={6}
                    className={className}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                />
            ) : (
                <input
                    id={id}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    className={className}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                />
            )}

            {error && (
                <p id={errorId} className="text-xs font-medium text-highlight">
                    {error}
                </p>
            )}
        </div>
    )
}
