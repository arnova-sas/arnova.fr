# arnova.fr

Corporate website for **ARNOVA** — a French digital marketing company and web publisher
(SAS, RCS Paris, APE 63.12Z "Portails Internet").

Bilingual (French / English) marketing site with a homepage, a contact form and three
legal pages: legal notice, privacy policy and cookies.

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
pnpm install
cp .env.example .env.local   # then fill in the Web3Forms key
pnpm dev                     # http://localhost:3000
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
    [locale]/           layout, home, contact, legal pages (mentions-legales,
                        confidentialite, cookies), not-found + [...rest] catch-all
    globals.css         Tailwind v4 theme tokens (light + dark)
    robots.ts
    sitemap.ts
  components/           header, footer, locale switcher, contact form, primitives
    legal/              shared legal-page layout + scrollspy table of contents
  config/company.ts     single source of truth for legal + contact identity
  i18n/                 routing, navigation wrappers, per-request config
  lib/
    contact-form.ts     form validation rules (locale-agnostic error codes)
    legal-pages.ts      legal pages in tab order, with their last-updated dates
    structured-data.ts  Organization JSON-LD for the home page
    metadata.ts         canonical + hreflang helpers
  proxy.ts              locale negotiation (Next 16 renamed `middleware` -> `proxy`)
scripts/
  check-messages.mjs    fails CI when fr/en catalogues drift apart
  check-contrast.mjs    fails CI when a colour pair in globals.css drops below WCAG AA
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
  `pnpm check:messages` (`scripts/check-messages.mjs`, a dedicated CI step) keeps
  `en.json` in sync.
- Messages are parsed as ICU MessageFormat: use typographic apostrophes (`’`), never
  straight ones (`'`), which ICU treats as an escape character.

## Legal data

`src/config/company.ts` is the only place company facts are stored; both locales and
both the footer and the legal notice read from it. The values come from the French
public company registry (INSEE / RNE) for SIREN **942070392**. The intra-community VAT
number is derived from the SIREN: `key = (12 + 3 × (SIREN mod 97)) mod 97`.

The third-party services the site relies on (host, DNS, form delivery, mail redirect,
mailbox) are listed there too, so the legal pages name them from one place. Countries are
stored as ISO codes and printed in the reader's language.

`contact@arnova.fr` has no mailbox: OVHcloud receives it (MX `mx1-3.mail.ovh.net`) and
redirects it, without a local copy, to the same consumer Gmail inbox the form delivers to.
The domain sends no mail (SPF `v=spf1 -all`). If that changes — an OVH mailbox, Google
Workspace, or replying as `contact@` — update `mailRelay` / `mailProvider`, the privacy
policy's recipients and transfers, and the SPF record together.

When a legal page's wording changes, bump its `updatedOn` in `src/lib/legal-pages.ts`.
When the home or contact copy changes, bump its `lastModified` in `src/app/sitemap.ts`.

The privacy policy states what Web3Forms' own privacy policy says: it keeps submissions
for at most three years and may pass the sender's IP and email to anti-spam services.
Re-check <https://web3forms.com/privacy> if that page is reworded.

## Scripts

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm start            # serve the production build
pnpm lint             # Biome check
pnpm lint:fix         # Biome check --write
pnpm typecheck        # tsc --noEmit
pnpm prettier         # format CSS / Markdown / YAML
pnpm prettier:check   # verify CSS / Markdown / YAML formatting
pnpm check:messages   # fr/en message catalogue parity
pnpm check:contrast   # WCAG AA contrast of the globals.css palette
pnpm lint-ci          # lint + typecheck + check:messages + check:contrast
```

CI (`.github/workflows/ci.yml`) runs lint, `prettier:check`, typecheck, the messages and
contrast checks and `pnpm build` as separate steps on every push to `main` and every pull
request.

## Deployment

Live at <https://arnova.fr>, hosted on Vercel through its Git integration: pushes to
`main` deploy to production and pull requests get preview deployments. GitHub Actions
only validates the code.

`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set in the Vercel project (**Settings → Environment
Variables**); since it is inlined at build time, redeploy after changing it.

`vercel.json` pins the build to the `cdg1` (Paris) region and uses a frozen-lockfile
install. No other configuration is needed — the framework is auto-detected.

## Brand assets

The logo is the source of the palette, not the other way round: `--accent` is the
mark's own teal (`#235964`).

| File                        | Purpose                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `public/logo.png`           | Master artwork as supplied — 512×512, white background                                   |
| `public/logo-mark.png`      | Transparent mark in brand teal, for light backgrounds                                    |
| `public/logo-mark-dark.png` | Same mark tinted `#7fb9c6`, for dark backgrounds                                         |
| `src/app/icon.png`          | Favicon (white background — a transparent mark vanishes in light chrome)                 |
| `src/app/apple-icon.png`    | iOS home-screen icon; iOS applies its own rounding                                       |
| `public/og-image.png`       | 1200×630 link-preview card for Open Graph and X (`socialImage` in `src/lib/metadata.ts`) |

Two tints exist because the brand teal falls to roughly 1.6:1 against the dark-mode
background. `LogoMark` swaps them with Tailwind's `dark:` variant, which keys off
`prefers-color-scheme` — the same signal `globals.css` uses, so they cannot disagree.

`pnpm check:contrast` parses the tokens straight out of `globals.css` and fails if any
foreground/background pair drops below WCAG AA (4.5:1). It runs in CI, so a palette
tweak that hurts legibility breaks the build rather than shipping.

> The master is a raster PNG, so the emblem's finer details (the dashed arc, the network
> nodes) go soft at the 36px header size on non-retina displays. An SVG master would fix
> that permanently and shrink the assets — worth requesting if the logo source exists.
