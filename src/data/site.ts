/**
 * Global site configuration.
 * Search indexing is on. Set PUBLIC_NOINDEX=true at build time to hide the site from search engines.
 * Draft sectors and the 404 page are always noindex.
 */
export const site = {
  name: 'Valuation & Advisory Services',
  org: 'Colliers',
  title: 'Colliers | Valuation & Advisory Services — Capability Statement',
  description:
    'Specialist property investment advice, research and analysis, reflecting real-time market conditions. Colliers Valuation & Advisory Services, Australia.',
  locale: 'en-AU',
  noindex: (import.meta.env.PUBLIC_NOINDEX ?? 'false') === 'true',
  colliersUrl: 'https://www.colliers.com.au/',
  privacyUrl: 'https://www.colliers.com/en-au/privacy-policy',
  disclaimer: 'Liability limited by a scheme approved under Professional Standards Legislation.',
  documentLabel: 'Capability Statement | Valuation & Advisory Services',
  /** Expert id used for the primary contact CTA. */
  primaryContact: 'dwight-hillier',
} as const;
