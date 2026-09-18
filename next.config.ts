import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/**
 * Baseline security headers. Vercel adds HSTS on custom domains, so it is not
 * repeated here; everything below also applies to `yarn dev` and `yarn start`.
 */
const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

const nextConfig: NextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }]
    },
}

export default withNextIntl(nextConfig)
