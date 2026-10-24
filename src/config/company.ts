/**
 * Single source of truth for ARNOVA's legal and contact identity.
 *
 * Every value below is verified against the French public company registry
 * (INSEE / RNE, exposed by recherche-entreprises.api.gouv.fr) for SIREN 942070392.
 * The intra-community VAT number is derived from the SIREN using the standard
 * French key algorithm: key = (12 + 3 * (SIREN mod 97)) mod 97 -> 79.
 *
 * Keep this file locale-agnostic: it holds facts, not prose. Translated labels
 * (legal form wording, section titles, ...) live in `messages/{locale}.json`.
 */
export const company = {
    name: 'ARNOVA',
    legalForm: 'SAS',
    /** Share capital as registered with the RCS. */
    capital: '1 000 €',
    siren: '942 070 392',
    siret: '942 070 392 00017',
    /** Registry of commerce the company is filed with. */
    rcsCity: 'Paris',
    vat: 'FR79942070392',
    /** NAF/APE code 63.12Z — "Portails Internet" / web portals. */
    ape: '63.12Z',
    /** ISO date of incorporation, as recorded by the RNE. */
    incorporatedOn: '2025-03-12',
    address: {
        street: '200 rue de la Croix Nivert',
        postalCode: '75015',
        city: 'Paris',
        country: 'France',
        /** ISO 3166-1 alpha-2, for structured data. */
        countryCode: 'FR',
    },
    /**
     * Public address shown on the site. Mail sent to it goes through `mailRelay` to the Gmail
     * inbox; the contact form reaches the same inbox through Web3Forms.
     */
    email: 'contact@arnova.fr',
    publicationDirector: 'Guillaume Sainthillier',
    /** Required in French "mentions légales": identity of the hosting provider. */
    host: {
        name: 'Vercel Inc.',
        address: '440 N Barranca Avenue #4133, Covina, CA 91723',
        /** ISO 3166-1 alpha-2; pages print it with `regionName()` in the reader's language. */
        countryCode: 'US',
        url: 'https://vercel.com',
        privacyUrl: 'https://vercel.com/legal/privacy-policy',
    },
    /**
     * DNS only: the records are not proxied, so Cloudflare never sees page traffic
     * (check with `dig +short arnova.fr` — the answers are Vercel addresses).
     */
    dnsProvider: {
        name: 'Cloudflare, Inc.',
        url: 'https://www.cloudflare.com',
    },
    /**
     * Receives contact-form submissions straight from the browser and forwards them
     * by email. Operated by Web3Creative (India) on AWS infrastructure; its privacy
     * policy states that submissions are kept for at most three years and that the
     * sender's IP and email may be checked by anti-spam services.
     */
    formProcessor: {
        name: 'Web3Forms',
        operator: 'Web3Creative',
        countryCode: 'IN',
        url: 'https://web3forms.com',
        privacyUrl: 'https://web3forms.com/privacy',
    },
    /**
     * Receives the mail sent to `email` (the MX records point to mx1-3.mail.ovh.net, OVH SAS
     * servers in France) and redirects it to the Gmail inbox without keeping a copy. The
     * domain has no OVH mailbox and sends no mail (SPF `-all`).
     */
    mailRelay: {
        name: 'OVHcloud',
        operator: 'OVH SAS',
        countryCode: 'FR',
        url: 'https://www.ovhcloud.com',
    },
    /**
     * Hosts the Gmail inbox both the contact form and `mailRelay` deliver to. It is a consumer
     * Gmail account, not Google Workspace: no data processing agreement, and EEA users'
     * contract is with Google Ireland Limited.
     */
    mailProvider: {
        name: 'Google',
        service: 'Gmail',
        operator: 'Google Ireland Limited',
        countryCode: 'IE',
        privacyUrl: 'https://policies.google.com/privacy',
    },
    siteUrl: 'https://arnova.fr',
} as const

export const formattedAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`
