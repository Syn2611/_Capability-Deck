import type { ImageMetadata } from 'astro';

import dwight from '../assets/images/experts/dwight-hillier.jpg';
import collins from '../assets/images/experts/andrew-collins.jpg';
import petsalis from '../assets/images/experts/jonathan-petsalis.jpg';
import hadchiti from '../assets/images/experts/leon-hadchiti.jpg';
import ajohnston from '../assets/images/experts/andrew-johnston.jpg';
import milou from '../assets/images/experts/christopher-milou.jpg';
import cameron from '../assets/images/experts/stephen-cameron.jpg';
import western from '../assets/images/experts/phil-western.jpg';
import mccallum from '../assets/images/experts/ben-mccallum.jpg';
import djohnston from '../assets/images/experts/dean-johnston.jpg';
import murdoch from '../assets/images/experts/lisa-murdoch.jpg';
import shadbolt from '../assets/images/experts/matt-shadbolt.jpg';

export interface Expert {
  id: string;
  name: string;
  /** Single editable title field (PDF titles by default — see CONTENT_GAPS.md). */
  title: string;
  team?: string;
  phone?: string;
  email?: string;
  bio?: string;
  /** Additional verified-on-request detail, shown beneath the bio. */
  note?: string;
  photo?: ImageMetadata;
  /** Shown in the home-page "Our Experts" section. */
  featured?: boolean;
  /** Leadership team members appear first. */
  leadership?: boolean;
}

const VA = 'Valuation & Advisory Services';

/** Source: Capability Statement 2025 (with contacts). */
const pdfExperts: Expert[] = [
  {
    id: 'dwight-hillier',
    name: 'Dwight Hillier',
    title: 'Managing Director',
    team: VA,
    phone: '+61 411 266 175',
    email: 'dwight.hillier@colliers.com',
    photo: dwight,
    featured: true,
    leadership: true,
    bio: 'Dwight oversees the strategy and operations of Colliers’ multidisciplinary and diverse Valuation & Advisory Services, Strategic Advisory and Healthcare & Retirement Living Transactions teams. His focus is ensuring the sustained growth and success of the service offering, so clients receive the highest quality advice possible.',
  },
  {
    id: 'andrew-collins',
    name: 'Andrew Collins',
    title: 'Head of Risk & Business Transformation',
    team: VA,
    phone: '+61 434 070 452',
    email: 'andrew.collins@colliers.com',
    photo: collins,
    featured: true,
    leadership: true,
    bio: 'Andrew has over 30 years’ experience in agency, valuation and risk management across a range of real estate sectors, including residential, retail, industrial, commercial, development and specialised assets. He has been with the Colliers Valuation & Advisory Services, Strategic Advisory and Healthcare & Retirement Living Transactions teams since 2014.',
  },
  {
    id: 'jonathan-petsalis',
    name: 'Jonathan Petsalis',
    title: 'Head of Office',
    team: VA,
    phone: '+61 415 507 150',
    email: 'jonathan.petsalis@colliers.com',
    photo: petsalis,
    featured: true,
    bio: 'As Head of Office, Jonathan leads the national office team and specialises in the valuation of institutional-grade office buildings, CBD office developments, and office rental assessments and determinations.',
  },
  {
    id: 'leon-hadchiti',
    name: 'Leon Hadchiti',
    title: 'National Director, Healthcare & Retirement Living',
    team: VA,
    phone: '+61 422 477 293',
    email: 'leon.hadchiti@colliers.com',
    photo: hadchiti,
    featured: true,
    bio: 'Leon is responsible for the management of the national Healthcare & Retirement Living Valuation & Advisory Services team, who work across retirement villages, residential aged care facilities, healthcare and manufactured home estates.',
  },
  {
    id: 'andrew-johnston',
    name: 'Andrew Johnston',
    title: 'Head of Retail',
    team: VA,
    phone: '+61 410 533 320',
    email: 'andrew.johnston@colliers.com',
    photo: ajohnston,
    featured: true,
    bio: 'As Head of Retail, Andrew sets the strategy and direction of the national retail team and specialises in the valuation of super-regional, regional, sub-regional and neighbourhood shopping centres across Australia.',
  },
  {
    id: 'christopher-milou',
    name: 'Christopher Milou',
    title: 'Head of Hotels',
    team: VA,
    phone: '+61 413 615 398',
    email: 'christopher.milou@colliers.com',
    photo: milou,
    featured: true,
    bio: 'As Head of Hotels, Christopher oversees the strategy and operations of the national hotels team. He specialises in the valuation of going-concern properties in the hospitality, student accommodation, co-living, build-to-rent and car parking sectors.',
  },
  {
    id: 'stephen-cameron',
    name: 'Stephen Cameron',
    title: 'National Director, Agribusiness',
    team: VA,
    phone: '+61 438 180 278',
    email: 'stephen.cameron@colliers.com',
    photo: cameron,
    featured: true,
    bio: 'Stephen oversees medium to high value portfolio valuations nationally and has forged strong relationships with his clients. Valuation purposes have included mortgage security, asset management, capital gains tax, dispute resolution, litigation, company portfolios, carbon trading and resumption matters.',
    note: 'Has acted as an expert witness in the Land Court and Supreme Court of Queensland.',
  },
  {
    id: 'phil-western',
    name: 'Phil Western',
    title: 'National Director, Government',
    team: VA,
    phone: '+61 428 659 993',
    email: 'phil.western@colliers.com',
    photo: western,
    featured: true,
    bio: 'Phil develops and leads the Government & Legal Services business. With over 30 years’ experience in the Australian and New Zealand government property sector, he specialises in risk management, quality assurance, governance and legislative frameworks.',
    note: 'NSW Valuer General for 11 years, to 2014.',
  },
  {
    id: 'ben-mccallum',
    name: 'Ben McCallum',
    title: 'National Director',
    team: VA,
    phone: '+61 401 120 860',
    email: 'ben.mccallum@colliers.com',
    photo: mccallum,
    featured: true,
    bio: 'Ben leads the Victorian Valuation & Advisory Services business, with a specialised focus on the Industrial and Corporate sectors, and leads Plant & Machinery nationally. He is a trusted advisor to Australia’s largest listed and unlisted property trusts, financial institutions and corporations.',
  },
  {
    id: 'dean-johnston',
    name: 'Dean Johnston',
    title: 'National Director, WA',
    team: VA,
    phone: '+61 488 280 998',
    email: 'dean.johnston@colliers.com',
    photo: djohnston,
    featured: true,
    bio: 'Dean is responsible for the management of Valuation & Advisory Services in Western Australia. With Colliers for the past 16 years, he provides services to listed property trusts, financial institutions, developers, syndicates, private investors and all levels of government.',
  },
  {
    id: 'lisa-murdoch',
    name: 'Lisa Murdoch',
    title: 'National Director, QLD',
    team: VA,
    phone: '+61 402 092 503',
    email: 'lisa.murdoch@colliers.com',
    photo: murdoch,
    featured: true,
    bio: 'Lisa leads the Queensland Valuation & Advisory Services team. She has broad experience across all investment property types, including retail, industrial and commercial assets, as well as going-concern valuations including marinas and manufactured home parks.',
  },
  {
    id: 'matt-shadbolt',
    name: 'Matt Shadbolt',
    title: 'Head of Mortgage',
    team: VA,
    phone: '+61 417 465 676',
    email: 'matt.shadbolt@colliers.com',
    photo: shadbolt,
    featured: true,
    bio: 'Matt heads the Colliers valuation mortgage teams in NSW, VIC, ACT and SA, with deep valuation and leadership experience across diverse assets, including in Europe. He is building Colliers’ presence in the $25M mortgage middle market for office, industrial and retail properties.',
  },
];

/** Named on the Colliers sector web pages — contact details and photos pending. */
const webExperts: Expert[] = [
  { id: 'peter-volakos', name: 'Peter Volakos', title: 'National Director, Office' },
  { id: 'cassandra-mortimer', name: 'Cassandra Mortimer', title: 'Director, Office' },
  { id: 'robert-rixon', name: 'Robert Rixon', title: 'National Director' },
  { id: 'ben-masters', name: 'Ben Masters', title: 'Director' },
  { id: 'devan-vituli', name: 'Devan Vituli', title: 'Director' },
  { id: 'andrew-govey', name: 'Andrew Govey', title: 'National Director, Metropolitan Valuations' },
  {
    id: 'bernard-peverill',
    name: 'Bernard Peverill',
    title: 'National Director, Development & Infrastructure Advisory',
  },
  { id: 'hamish-johnston', name: 'Hamish Johnston', title: 'Director, Office' },
  { id: 'james-farrugia', name: 'James Farrugia', title: 'National Director, NSW Industrial' },
  { id: 'connie-ndungu', name: 'Connie Ndungu', title: 'Associate Director, Industrial' },
  { id: 'stanley-ferro', name: 'Stanley Ferro', title: 'Associate Director, Industrial' },
  { id: 'zane-gil', name: 'Zane Gil', title: 'Director' },
  { id: 'josh-swan', name: 'Josh Swan', title: 'Manager' },
  { id: 'oliver-wheatley', name: 'Oliver Wheatley', title: 'Senior Valuer' },
  { id: 'rob-hancock', name: 'Rob Hancock', title: 'Associate Director' },
  { id: 'nigel-boon', name: 'Nigel Boon', title: 'Director' },
  { id: 'jennifer-wong', name: 'Jennifer Wong', title: 'Director' },
  { id: 'david-mugenyi', name: 'David Mugenyi', title: 'Director' },
  { id: 'rishikesh-elkunchwar', name: 'Rishikesh Elkunchwar', title: 'Director' },
  {
    id: 'andrew-stove',
    name: 'Andrew Stove',
    title: 'National Director, Specialist Valuations, Service Stations',
  },
];

export const experts: Expert[] = [...pdfExperts, ...webExperts];

const byId = new Map(experts.map((e) => [e.id, e]));

export function getExpert(id: string): Expert {
  const e = byId.get(id);
  if (!e) throw new Error(`Unknown expert id "${id}" — add it to src/data/experts.ts`);
  return e;
}

export const featuredExperts = experts.filter((e) => e.featured);

/** Experts with a bio open a dialog; others render as a static card. */
export const hasDetail = (e: Expert) => Boolean(e.bio || e.email || e.phone);
