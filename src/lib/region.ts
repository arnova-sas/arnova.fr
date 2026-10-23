/** Country name in the reader's language, from an ISO 3166-1 alpha-2 code (`US` -> "États-Unis"). */
export function regionName(code: string, locale: string) {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
}
