/**
 * Fails the build when `messages/en.json` drifts out of sync with the French
 * reference catalogue. TypeScript only types keys against `fr.json`, so a
 * missing English key would otherwise surface as a raw key in production.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (locale) => JSON.parse(readFileSync(`${root}messages/${locale}.json`, 'utf8'))

const flatten = (value, prefix = '') =>
    Object.entries(value).flatMap(([key, child]) =>
        child && typeof child === 'object' ? flatten(child, `${prefix}${key}.`) : [`${prefix}${key}`]
    )

const reference = flatten(read('fr'))
const translated = flatten(read('en'))

const missing = reference.filter((key) => !translated.includes(key))
const extra = translated.filter((key) => !reference.includes(key))

if (missing.length > 0 || extra.length > 0) {
    if (missing.length > 0) console.error(`Missing in en.json:\n  ${missing.join('\n  ')}`)
    if (extra.length > 0) console.error(`Not in fr.json:\n  ${extra.join('\n  ')}`)
    process.exit(1)
}

console.log(`messages: ${reference.length} keys, fr and en in sync`)
