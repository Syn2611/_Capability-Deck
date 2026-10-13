import type { ImageMetadata } from 'astro';

import assureLogo from '../assets/images/certs/colliers-assure.webp';
import iso9001Logo from '../assets/images/certs/iso-9001-sai-global.webp';
import iso27001Logo from '../assets/images/certs/iso-27001-cpg.webp';

/** Colliers Assure: multi-stage peer review. Stages and wording from the Quality Assurance page (2026). */
export const qaSteps = [
  {
    title: 'Thoroughly understand requirements',
    text: 'We understand client requirements, assess potential risks and review industry intelligence before formalising instructions.',
  },
  {
    title: 'Critique calculations & valuation',
    text: 'Certified professionals critique every stage. All calculations and advice are reviewed, verified and referenced against external sources.',
  },
  {
    title: 'Independent risk-audit clearance',
    text: 'Any risk issues are resolved before the valuation or advice is released.',
  },
];

export interface Certification {
  id: string;
  name: string;
  role: string;
  logo: ImageMetadata;
  /** Accessible name of the logo artwork. */
  alt: string;
}

export const certifications: Certification[] = [
  {
    id: 'assure',
    name: 'Colliers Assure',
    role: 'Multi-stage peer-review methodology',
    logo: assureLogo,
    alt: 'Colliers Assure',
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001 Quality',
    role: '5 Ticks StandardsMark, SAI Global (Intertek)',
    logo: iso9001Logo,
    alt: '5 Ticks StandardsMark: Certified System, Quality ISO 9001, Intertek SAI Global',
  },
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001:2022',
    role: 'Information security, Certification Partner Global',
    logo: iso27001Logo,
    alt: 'CPG Certification Partner Global, ISO/IEC 27001:2022',
  },
];
