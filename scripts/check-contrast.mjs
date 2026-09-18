/**
 * Verifies the palette in `src/app/globals.css` meets WCAG AA (4.5:1) in both
 * colour schemes.
 *
 * The token values are read from the stylesheet rather than duplicated here, so
 * editing a colour is enough to re-check it — there is no second list to keep in
 * sync. Dark mode inherits any token it does not override.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CSS = readFileSync(fileURLToPath(new URL('../src/app/globals.css', import.meta.url)), 'utf8')

/** Foreground token, background token, minimum ratio. Checked in both schemes. */
const PAIRS = [
    ['foreground', 'background', 4.5],
    ['muted', 'background', 4.5],
    ['muted', 'surface', 4.5],
    ['accent', 'background', 4.5],
    ['accent', 'accent-soft', 4.5],
    ['accent-foreground', 'accent', 4.5],
    ['accent-foreground', 'accent-hover', 4.5],
    ['highlight', 'background', 4.5],
    ['foreground-invert', 'surface-invert', 4.5],
    ['muted-invert', 'surface-invert', 4.5],
]

function parseBlock(source) {
    const tokens = {}
    for (const [, name, value] of source.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6});/g)) {
        tokens[name] = value
    }
    return tokens
}

const rootBlock = CSS.match(/:root\s*\{([^}]*)\}/)
const darkBlock = CSS.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}/)

if (!rootBlock || !darkBlock) {
    console.error('Could not locate the :root and dark-mode token blocks in globals.css')
    process.exit(1)
}

const light = parseBlock(rootBlock[1])
const dark = { ...light, ...parseBlock(darkBlock[1]) }

const channel = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

function luminance(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => channel(Number.parseInt(hex.slice(i, i + 2), 16) / 255))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a, b) {
    const [x, y] = [luminance(a), luminance(b)]
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

let failed = 0

for (const [schemeName, tokens] of [
    ['light', light],
    ['dark', dark],
]) {
    for (const [fg, bg, minimum] of PAIRS) {
        if (!tokens[fg] || !tokens[bg]) {
            console.error(`${schemeName}: unknown token --${tokens[fg] ? bg : fg}`)
            failed++
            continue
        }

        const value = ratio(tokens[fg], tokens[bg])
        if (value < minimum) {
            console.error(
                `${schemeName}: --${fg} on --${bg} is ${value.toFixed(2)}:1, below the ${minimum}:1 minimum`
            )
            failed++
        }
    }
}

if (failed > 0) {
    process.exit(1)
}

console.log(`contrast: ${PAIRS.length * 2} pairs checked across both schemes, all AA`)
