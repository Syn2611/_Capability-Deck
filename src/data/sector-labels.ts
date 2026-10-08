import type { SectorSlug } from './projects';

/** Short labels used on cards (kept in sync with content/sectors/*.md `shortTitle`). */
export const sectorLabels: Record<SectorSlug, string> = {
  office: 'Office',
  'industrial-logistics': 'Industrial',
  retail: 'Retail',
  'hotels-living': 'Hotels & Living',
  agribusiness: 'Agribusiness',
  'healthcare-retirement-living': 'Healthcare & Retirement',
  'government-legal': 'Government',
  mortgage: 'Mortgage',
  'data-centres': 'Data Centres',
  'self-storage': 'Self Storage',
  'childcare-education': 'Childcare',
  'service-stations': 'Service Stations',
  'plant-machinery': 'Plant & Machinery',
  'extractive-waste': 'Extractive & Waste',
};
