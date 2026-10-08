import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sectors = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sectors' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      title: z.string(),
      shortTitle: z.string(),
      /** One line, set in Merriweather under the H1. Optional for drafts. */
      descriptor: z.string().optional(),
      stat: z
        .object({
          value: z.string(),
          label: z.string(),
          asOf: z.string(),
          source: z.string(),
        })
        .optional(),
      services: z.array(z.string()).default([]),
      /** Mark the service list for internal review (no source page). */
      servicesReview: z.boolean().default(false),
      assetTypes: z.array(z.string()).default([]),
      /** Expert ids from src/data/experts.ts, lead excluded. */
      experts: z.array(z.string()).default([]),
      leadExpert: z.string().optional(),
      heroImage: image(),
      heroAlt: z.string(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { sectors };
