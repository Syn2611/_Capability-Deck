/**
 * Global site configuration.
 * `noindex` defaults to true: this is a client-share document, not a public marketing page.
 * Flip it to `false` (or set PUBLIC_NOINDEX=false) when the site should be indexed.
 */
export const site = {
  name: 'Valuation & Advisory Services',
  org: 'Colliers',
  title: 'Colliers | Valuation & Advisory Services — Capability Statement',
  description:
    'Specialist property investment advice, research and analysis, reflecting real-time market conditions. Colliers Valuation & Advisory Services, Australia.',
  locale: 'en-AU',
  noindex: (import.meta.env.PUBLIC_NOINDEX ?? 'true') !== 'false',
  colliersUrl: 'https://www.colliers.com.au/',
  privacyUrl: 'https://www.colliers.com/en-au/privacy-policy',
  disclaimer: 'Liability limited by a scheme approved under Professional Standards Legislation.',
  documentLabel: 'Capability Statement | Valuation & Advisory Services',
  /** Expert id used for the primary contact CTA. */
  primaryContact: 'dwight-hillier',
} as const;
