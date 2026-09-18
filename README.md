# arnova.fr

Corporate website for **ARNOVA** — a French digital marketing company and web publisher
(SAS, RCS Paris, APE 63.12Z "Portails Internet").

Bilingual (French / English) marketing site with a homepage, a contact form and a
legal notice.

## Stack

| Concern       | Choice                                      |
| ------------- | ------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack)          |
| Language      | TypeScript (strict)                         |
| Styling       | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| i18n          | next-intl 4 (`fr` default, `en`)            |
| Contact form  | Web3Forms (no backend, no server secret)    |
| Lint / format | Biome (JS/TS/JSON) + Prettier (CSS/MD/YAML) |
| Hosting       | Vercel                                      |

## Getting started

```bash
yarn install
cp .env.example .env.local   # then fill in the Web3Forms key
yarn dev                     # http://localhost:3000
```

## Environment variables

| Variable                           | Required | Notes                                                                                                                                               |
| ---------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | yes      | Free key from [web3forms.com](https://web3forms.com), bound to the destination inbox. Public by design — it only permits posting to that one inbox. |

Without the key the contact page degrades gracefully to a `mailto:` link instead of
rendering a button that would silently fail.

> `NEXT_PUBLIC_*` values are inlined **at build time**. Setting the variable in the
> Vercel dashboard is enough for production, but an existing deployment must be
> rebuilt for a changed value to take effect.

## Project structure

```
messages/               fr.json / en.json — every user-facing string
src/
  app/
    [locale]/           layout, home, contact, mentions-legales, not-found
    globals.css         Tailwind v4 theme tokens (light + dark)
    robots.ts
    sitemap.ts
  components/           header, footer, locale switcher, contact form, primitives
  config/company.ts     single source of truth for legal + contact identity
  i18n/                 routing, navigation wrappers, per-request config
  lib/
    contact-form.ts     form validation rules (locale-agnostic error codes)
    metadata.ts         canonical + hreflang helpers
  proxy.ts              locale negotiation (Next 16 renamed `middleware` -> `proxy`)
scripts/
  check-messages.mjs    fails CI when fr/en catalogues drift apart
```

## Internationalisation

- French is the default locale and is served **unprefixed** (`/contact`); English is
  always prefixed (`/en/contact`).
- Pathnames are localised: `/mentions-legales` ↔ `/en/legal-notice`. The mapping lives in
  `src/i18n/routing.ts`; requesting the wrong-locale spelling 307s to the canonical one.
- Always import `Link`, `redirect`, `usePathname` and `useRouter` from
  `@/i18n/navigation` — never from `next/link` or `next/navigation` — so the prefix and
  the localised pathnames are applied.
- Translation keys are type-checked against `messages/fr.json` (see `global.d.ts`), and
  `yarn build` in CI runs `scripts/check-messages.mjs` to keep `en.json` in sync.
- Messages are parsed as ICU MessageFormat: use typographic apostrophes (`’`), never
  straight ones (`'`), which ICU treats as an escape character.

## Legal data

`src/config/company.ts` is the only place company facts are stored; both locales and
both the footer and the legal notice read from it. The values come from the French
public company registry (INSEE / RNE) for SIREN **942070392**. The intra-community VAT
number is derived from the SIREN: `key = (12 + 3 × (SIREN mod 97)) mod 97`.

Update `LEGAL_UPDATED_ON` in `src/app/[locale]/mentions-legales/page.tsx` whenever the
wording of the notice changes.

## Scripts

```bash
yarn dev              # dev server
yarn build            # production build
yarn start            # serve the production build
yarn lint             # Biome check
yarn lint:fix         # Biome check --write
yarn typecheck        # tsc --noEmit
yarn prettier         # format CSS / Markdown / YAML
yarn lint-ci          # lint + typecheck
```

## Deployment

Hosted on Vercel. Import the repository, then:

1. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in **Settings → Environment Variables**
   (Production, Preview and Development).
2. Add the `arnova.fr` domain and point the DNS records at Vercel.
3. Pushes to `main` deploy to production; pull requests get preview deployments.

`vercel.json` pins the build to the `cdg1` (Paris) region and uses a frozen-lockfile
install. No other configuration is needed — the framework is auto-detected.

## Brand assets

The logo is the source of the palette, not the other way round: `--accent` is the
mark's own teal (`#235964`).

| File                          | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `public/logo.png`             | Master artwork as supplied — 512×512, white background                   |
| `public/logo-mark.png`        | Transparent mark in brand teal, for light backgrounds                    |
| `public/logo-mark-dark.png`   | Same mark tinted `#7fb9c6`, for dark backgrounds                         |
| `src/app/icon.png`            | Favicon (white background — a transparent mark vanishes in light chrome) |
| `src/app/apple-icon.png`      | iOS home-screen icon; iOS applies its own rounding                       |
| `src/app/opengraph-image.png` | 1200×630 link-preview card                                               |
| `src/app/twitter-image.png`   | Same card, declared separately for X                                     |

Two tints exist because the brand teal falls to roughly 1.6:1 against the dark-mode
background. `LogoMark` swaps them with Tailwind's `dark:` variant, which keys off
`prefers-color-scheme` — the same signal `globals.css` uses, so they cannot disagree.

`yarn check:contrast` parses the tokens straight out of `globals.css` and fails if any
foreground/background pair drops below WCAG AA (4.5:1). It runs in CI, so a palette
tweak that hurts legibility breaks the build rather than shipping.

> The master is a raster PNG, so the emblem's finer details (the dashed arc, the network
> nodes) go soft at the 36px header size on non-retina displays. An SVG master would fix
> that permanently and shrink the assets — worth requesting if the logo source exists.
