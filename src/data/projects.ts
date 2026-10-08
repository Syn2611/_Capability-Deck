import type { ImageMetadata } from 'astro';

import georgePlace from '../assets/images/projects/george-place-sydney.jpg';
import farrer from '../assets/images/projects/1-farrer-place-sydney.jpg';
import smith from '../assets/images/projects/32-smith-street-parramatta.jpg';
import victoriaCross from '../assets/images/projects/victoria-cross-north-sydney.jpg';
import westin from '../assets/images/projects/the-westin-perth.jpg';
import urbanest from '../assets/images/projects/urbanest-portfolio.jpg';
import fourSeasons from '../assets/images/projects/four-seasons-sydney.jpg';
import ingenia from '../assets/images/projects/ingenia-communities.jpg';
import davidJones from '../assets/images/projects/david-jones-elizabeth-street.jpg';
import westfield from '../assets/images/projects/westfield-hurstville.jpg';
import bungarribee from '../assets/images/projects/bungarribee-keylink.jpg';
import industrialVic from '../assets/images/projects/industrial-portfolio-vic.jpg';
import pastoral from '../assets/images/projects/pastoral-portfolio-qld-nt.jpg';
import vitalharvest from '../assets/images/projects/vitalharvest-portfolio.jpg';
import retireAustralia from '../assets/images/projects/retire-australia-portfolio.jpg';
import japara from '../assets/images/projects/japara-healthcare-portfolio.jpg';
import sydneyMetro from '../assets/images/projects/sydney-metro.jpg';
import bp from '../assets/images/projects/bp-portfolio-australia.jpg';
import cqe from '../assets/images/projects/cqe-childcare-portfolio.jpg';
import abacus from '../assets/images/projects/abacus-self-storage.jpg';
import bpNz from '../assets/images/projects/bp-portfolio-new-zealand.jpg';

/** Sector slug — matches `src/content/sectors/<slug>.md`. */
export type SectorSlug =
  | 'office'
  | 'industrial-logistics'
  | 'retail'
  | 'hotels-living'
  | 'agribusiness'
  | 'healthcare-retirement-living'
  | 'government-legal'
  | 'mortgage'
  | 'data-centres'
  | 'self-storage'
  | 'childcare-education'
  | 'service-stations'
  | 'plant-machinery'
  | 'extractive-waste';

export interface Project {
  id: string;
  name: string;
  location: string;
  /** Key metric. Uses non-breaking spaces between number and unit. */
  metric: string;
  purpose?: string;
  /** Omitted where the source names no client. */
  client?: string;
  sector: SectorSlug;
  image?: ImageMetadata;
  /** Flag for CONTENT_GAPS — figure needs confirming. */
  verify?: string;
}

const NB = ' ';

/** Track record — valued in the last 24 months. Source: Capability Statement 2025. */
export const projects: Project[] = [
  {
    id: 'george-place',
    name: 'George Place, 363 & 345 George Street',
    location: 'Sydney, NSW',
    metric: `54,262.2${NB}m²`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'ISPT',
    sector: 'office',
    image: georgePlace,
    verify: 'Source shows “54,262,.2 m²”.',
  },
  {
    id: '1-farrer-place',
    name: '1 Farrer Place',
    location: 'Sydney, NSW',
    metric: `85,228.60${NB}m²`,
    purpose: 'Financial reporting',
    client: 'Dexus',
    sector: 'office',
    image: farrer,
  },
  {
    id: '32-smith-street',
    name: '32 Smith Street',
    location: 'Parramatta, NSW',
    metric: `27,229${NB}m²`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'GPT',
    sector: 'office',
    image: smith,
  },
  {
    id: 'victoria-cross',
    name: 'Victoria Cross Over Station Development',
    location: 'North Sydney, NSW',
    metric: `58,414${NB}m²`,
    purpose: 'Financial reporting',
    client: 'Lendlease',
    sector: 'office',
    image: victoriaCross,
  },
  {
    id: 'the-westin-perth',
    name: 'The Westin',
    location: 'Perth, WA',
    metric: `368${NB}hotel rooms`,
    client: 'YTL Hotels',
    sector: 'hotels-living',
    image: westin,
  },
  {
    id: 'urbanest',
    name: 'Urbanest Student Accommodation Portfolio',
    location: 'National',
    metric: `14${NB}PBSA properties`,
    purpose: 'Acquisition',
    client: 'Scape',
    sector: 'hotels-living',
    image: urbanest,
  },
  {
    id: 'four-seasons-sydney',
    name: 'Four Seasons Hotel Sydney',
    location: 'Sydney, NSW',
    metric: `531${NB}hotel rooms`,
    client: 'MAPS Hotels & Resorts',
    sector: 'hotels-living',
    image: fourSeasons,
  },
  {
    id: 'ingenia',
    name: 'Ingenia Communities Portfolio',
    location: 'NSW',
    metric: `1,546${NB}sites over 6 mixed-use parks`,
    client: 'Retire Australia',
    sector: 'healthcare-retirement-living',
    image: ingenia,
  },
  {
    id: 'david-jones',
    name: 'David Jones, Elizabeth Street',
    location: 'Sydney, NSW',
    metric: `32,883${NB}m²`,
    purpose: 'Acquisition',
    client: 'Charter Hall',
    sector: 'retail',
    image: davidJones,
  },
  {
    id: 'westfield-hurstville',
    name: 'Westfield Hurstville',
    location: 'Hurstville, NSW',
    metric: `61,047${NB}m²`,
    purpose: 'Financial reporting',
    client: 'Dexus',
    sector: 'retail',
    image: westfield,
  },
  {
    id: 'bungarribee-keylink',
    name: 'Bungarribee & Keylink North & South Industrial Estate',
    location: 'NSW',
    metric: `5${NB}properties`,
    client: 'Goodman',
    sector: 'industrial-logistics',
    image: bungarribee,
  },
  {
    id: 'industrial-portfolio-vic',
    name: 'Industrial Portfolio',
    location: 'VIC',
    metric: `31${NB}assets`,
    client: 'Frasers Logistics & Industrial Trust',
    sector: 'industrial-logistics',
    image: industrialVic,
  },
  {
    id: 'napco-pastoral',
    name: 'Large-scale pastoral portfolio',
    location: 'QLD & NT',
    metric: 'Large-scale pastoral portfolio',
    client: 'NAPCO',
    sector: 'agribusiness',
    image: pastoral,
  },
  {
    id: 'vitalharvest',
    name: 'Vitalharvest Portfolio',
    location: 'NSW, SA & TAS',
    metric: 'Berry & citrus portfolio',
    client: 'Perpetual & Grant Thornton (independent advisor)',
    sector: 'agribusiness',
    image: vitalharvest,
  },
  {
    id: 'retire-australia',
    name: 'Retire Australia Portfolio',
    location: 'NSW, QLD & SA',
    metric: `4,500+ seniors living & care apartments; greenfield sites across 33${NB}assets`,
    client: 'Retire Australia',
    sector: 'healthcare-retirement-living',
    image: retireAustralia,
  },
  {
    id: 'japara',
    name: 'Japara Healthcare Portfolio',
    location: 'NSW, VIC, QLD, SA & TAS',
    metric: `5,000+ aged care beds, 200 seniors living units & greenfield across 65${NB}sites`,
    client: 'Japara Healthcare Ltd',
    sector: 'healthcare-retirement-living',
    image: japara,
  },
  {
    id: 'sydney-metro',
    name: 'Sydney Metro Authority',
    location: 'NSW',
    metric: 'Mixed properties',
    purpose: 'Valuation & advisory for Sydney Metro West acquisitions',
    client: 'Sydney Metro',
    sector: 'government-legal',
    image: sydneyMetro,
  },
  {
    id: 'telstra-data-centre',
    name: 'Telstra Data Centre',
    location: 'Clayton, VIC',
    metric: `1${NB}data centre asset`,
    purpose: 'Potential acquisition',
    sector: 'data-centres',
  },
  {
    id: 'bp-portfolio',
    name: 'BP Portfolio',
    location: 'National',
    metric: `225${NB}BP-branded service stations`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'Charter Hall',
    sector: 'service-stations',
    image: bp,
  },
  {
    id: 'cqe-childcare',
    name: 'CQE Child Care Portfolio',
    location: 'National',
    metric: `71${NB}childcare assets`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'Charter Hall Social Infrastructure REIT',
    sector: 'childcare-education',
    image: cqe,
  },
  {
    id: 'abacus-self-storage',
    name: 'Abacus Self Storage Portfolio',
    location: 'National',
    metric: `24${NB}self-storage assets`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'Abacus Property',
    sector: 'self-storage',
    image: abacus,
  },
  {
    id: 'bp-portfolio-nz',
    name: 'BP New Zealand Portfolio',
    location: 'New Zealand',
    metric: `70${NB}BP-branded service stations`,
    purpose: 'Financial reporting & first mortgage security',
    client: 'Charter Hall',
    sector: 'service-stations',
    image: bpNz,
  },
];

/** Filter groups for the home-page track record. */
export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'office', label: 'Office', sectors: ['office'] },
  { id: 'retail', label: 'Retail', sectors: ['retail'] },
  { id: 'industrial', label: 'Industrial', sectors: ['industrial-logistics'] },
  { id: 'hotels-living', label: 'Hotels & Living', sectors: ['hotels-living'] },
  { id: 'agribusiness', label: 'Agribusiness', sectors: ['agribusiness'] },
  { id: 'hrl', label: 'HRL', sectors: ['healthcare-retirement-living'] },
  { id: 'government', label: 'Government', sectors: ['government-legal'] },
  {
    id: 'specialised',
    label: 'Specialised',
    sectors: ['data-centres', 'service-stations', 'childcare-education', 'self-storage'],
  },
] as const satisfies ReadonlyArray<{ id: string; label: string; sectors?: SectorSlug[] }>;

export function filterGroupOf(p: Project): string {
  const f = projectFilters.find((f) => 'sectors' in f && (f.sectors as readonly string[]).includes(p.sector));
  return f?.id ?? 'specialised';
}

/**
 * Projects to show on a sector page. Mortgage has no projects of its own, so it shows every
 * engagement valued for first-mortgage-security purposes.
 */
export function projectsForSector(slug: SectorSlug): Project[] {
  if (slug === 'mortgage') return projects.filter((p) => /first mortgage/i.test(p.purpose ?? ''));
  return projects.filter((p) => p.sector === slug);
}

/** Additional Office credentials (names only) — Colliers Office valuation web page. */
export const officeCredentials = [
  'Tower 2 and International House, International Towers Sydney',
  '25 Martin Place',
  '126 Phillip Street',
  'Darling Park & Cockle Bay Wharf',
  'Macquarie Bank Building, 1 Shelley Street',
  'Ernst & Young Centre, 580 George Street',
  'King Street Wharf Retail Precinct',
];
