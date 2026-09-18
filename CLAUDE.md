# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The corporate website of **ARNOVA** (SAS, RCS Paris, SIREN 942070392) — a French digital
marketing company and web publisher. Next.js 16 App Router, TypeScript, Tailwind v4,
bilingual FR/EN via next-intl, deployed on Vercel.

Read `README.md` first — it documents the structure, the i18n rules and the deployment
setup. The points below are the ones that are easy to get wrong.

## Conventions

- **Package manager is yarn.** Never npm or pnpm.
- **Formatting is Biome**, not ESLint: 4-space indent, 120 columns, single quotes,
  no semicolons, trailing commas `es5`. Run `yarn lint:fix` after editing.
  Prettier handles CSS / Markdown / YAML only.
- `yarn watch` does not exist here; Tailwind v4 is compiled by Next itself.

## i18n rules

- Every user-facing string lives in `messages/fr.json` + `messages/en.json`. Never
  hard-code copy in a component.
- French (`fr`) is the default and unprefixed; English is `/en/...`.
- Import navigation from `@/i18n/navigation`, never from `next/link` / `next/navigation`.
- Messages are ICU MessageFormat: use `’`, not `'`. A straight apostrophe silently
  escapes the rest of the message.
- Adding a key means adding it to **both** catalogues — `scripts/check-messages.mjs`
  fails CI otherwise, and TypeScript types keys off `fr.json` only.
- Adding a route means adding it to `pathnames` in `src/i18n/routing.ts`, creating the
  folder under `src/app/[locale]/` named after the **internal** path, and giving it a
  `generateMetadata` with `buildAlternates(...)` so hreflang stays correct.

## Company / legal data

`src/config/company.ts` is the single source of truth. Legal values are sourced from the
public French registry — do not edit them from memory; re-check against
`https://recherche-entreprises.api.gouv.fr/search?q=942070392`. Prose about those facts
belongs in the message catalogues, not in the config.

## Contact form

Posts directly to Web3Forms from the browser — there is no API route and no server-side
secret. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is public by design. Validation rules live in
`src/lib/contact-form.ts` and return error _codes_ resolved against `Contact.errors.*`;
keep them locale-agnostic.
