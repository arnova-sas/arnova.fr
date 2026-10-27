import { company } from '@/config/company'

/** schema.org `Organization` for the home page, built only from `company.ts`. */
export function organizationJsonLd() {
    const siren = company.siren.replace(/\s/g, '')

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${company.siteUrl}/#organization`,
        name: company.name,
        legalName: company.name,
        url: company.siteUrl,
        logo: `${company.siteUrl}/logo.png`,
        email: company.email,
        foundingDate: company.incorporatedOn,
        vatID: company.vat,
        identifier: [
            { '@type': 'PropertyValue', propertyID: 'SIREN', value: siren },
            { '@type': 'PropertyValue', propertyID: 'VAT', value: company.vat },
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: company.address.street,
            postalCode: company.address.postalCode,
            addressLocality: company.address.city,
            addressCountry: company.address.countryCode,
        },
        sameAs: [company.linkedinUrl],
    }
}

/** Serialises JSON-LD for a `<script>` tag; escaping `<` keeps a value from closing the tag early. */
export function serializeJsonLd(data: object) {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}
