export interface Stat {
  id: string;
  /** Display value, e.g. "$7.8bn+". The numeric part is animated, prefix/suffix are kept. */
  value: string;
  label: string;
  /** When the figure was true. Dated so it can be refreshed. */
  asOf: string;
  source: string;
  /** Rolling-window figures that must be re-verified before each send. */
  verify?: boolean;
}

export const stats = {
  specialists: {
    id: 'specialists',
    value: '50+',
    label: 'specialists across all property sectors in Australia',
    asOf: '2025',
    source: 'Capability Statement 2025',
  },
  qaYears: {
    id: 'qa-years',
    value: '25+',
    label: 'years of quality assurance at the core of the business',
    asOf: '2025',
    source: 'Capability Statement 2025',
  },
  countries: {
    id: 'countries',
    value: '70',
    label: 'countries in the Colliers network',
    asOf: '2025',
    source: 'Capability Statement 2025',
  },
  retail: {
    id: 'retail',
    value: '$50bn+',
    label: 'retail value across 100+ shopping centres valued in the last 12 months',
    asOf: 'TBC',
    source: 'Colliers Retail Valuation web page',
    verify: true,
  },
  industrial: {
    id: 'industrial',
    value: '$7.8bn+',
    label: 'of industrial space valued in the last 12 months',
    asOf: 'TBC',
    source: 'Colliers Industrial Valuation web page',
    verify: true,
  },
  hrl: {
    id: 'hrl',
    value: '~$7bn',
    label: 'of healthcare & retirement living assets valued and consulted on',
    asOf: 'TBC',
    source: 'Colliers Healthcare & Retirement Living web page',
    verify: true,
  },
  serviceStations: {
    id: 'service-stations',
    value: '400+',
    label: 'service stations valued annually across Australia & New Zealand',
    asOf: 'TBC',
    source: 'Colliers Service Stations web page',
    verify: true,
  },
} satisfies Record<string, Stat>;

export type StatId = keyof typeof stats;

/** Figures shown in the home-page numbers band (3–5). */
export const homeStats: Stat[] = [stats.specialists, stats.qaYears, stats.retail, stats.countries];
