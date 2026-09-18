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
    },
    email: 'arnova.gsainthillier@gmail.com',
    publicationDirector: 'Guillaume Sainthillier',
    /** Required in French "mentions légales": identity of the hosting provider. */
    host: {
        name: 'Vercel Inc.',
        address: '440 N Barranca Avenue #4133, Covina, CA 91723',
        country: 'United States',
        url: 'https://vercel.com',
    },
    siteUrl: 'https://arnova.fr',
} as const

export const formattedAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`
