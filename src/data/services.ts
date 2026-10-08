import type { IconName } from '../components/icons';

export interface Service {
  id: string;
  title: string;
  summary: string;
  icon: IconName;
}

/** The 11 core services — source: Capability Statement 2025 & brief §6.3. */
export const services: Service[] = [
  {
    id: 'acquisition-disposal',
    title: 'Acquisition & Disposal',
    summary: 'Advice from initial consideration through to disposal.',
    icon: 'exchange',
  },
  {
    id: 'advisory',
    title: 'Advisory Services',
    summary:
      'Market commentary, feasibility studies, lease analyses, site and residual land value, due diligence, asset performance reviews and highest and best use analysis.',
    icon: 'compass',
  },
  {
    id: 'capital-raising',
    title: 'Capital Raising',
    summary: 'Valuation and advice for raising capital against single assets or portfolios.',
    icon: 'growth',
  },
  {
    id: 'financial-reporting',
    title: 'Financial Reporting',
    summary:
      'AASB- and IFRS-compliant valuations for corporate, government, institutional and private clients.',
    icon: 'report',
  },
  {
    id: 'first-mortgage-security',
    title: 'First Mortgage Security',
    summary: 'Valuations built to meet major lenders’ reporting requirements.',
    icon: 'key',
  },
  {
    id: 'government-property',
    title: 'Government Property Services',
    summary:
      'Advice for all levels of government, including public open space, special uses and non-operational land.',
    icon: 'civic',
  },
  {
    id: 'insurance',
    title: 'Insurance Replacement Cost Estimates',
    summary: 'Reinstatement advice covering construction costs, lead times, demolition and removal.',
    icon: 'shield',
  },
  {
    id: 'plant-equipment',
    title: 'Plant & Equipment',
    summary:
      'Valuation across office, retail, industrial, hotels, agribusiness, healthcare, education, data centres and more.',
    icon: 'gear',
  },
  {
    id: 'rent-reviews',
    title: 'Rent Reviews & Determinations',
    summary: 'For rent reviews, rental determinations and dispute resolution, for lessors and lessees.',
    icon: 'calendar',
  },
  {
    id: 'statutory-litigation',
    title: 'Statutory & Litigation Matters',
    summary:
      'For statutory authorities and the legal community, including Family Law valuations and rental disputes.',
    icon: 'scales',
  },
  {
    id: 'taxation',
    title: 'Taxation',
    summary: 'Stamp duty assessment, GST valuation and fringe benefits tax advice.',
    icon: 'percent',
  },
];

/** Full sector coverage list as printed in the 2025 Capability Statement. */
export const sectorCoverage = [
  'Office',
  'Industrial',
  'Retail',
  'Agribusiness',
  'Hotels & hospitality venues',
  'Healthcare & retirement living',
  'Government property',
  'Extractive industries & waste management',
  'Plant & machinery',
  'Universities',
  'Schools',
  'Childcare centres',
  'Service stations',
  'Self-storage',
  'Student accommodation',
  'Car parks',
  'Data centres',
];
