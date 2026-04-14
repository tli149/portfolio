import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    year: z.string(),
    studio: z.string(),
    instructor: z.string(),
    partner: z.string().default('—'),
    location: z.string().default('—'),
    processCols: z.number().default(3),
    order: z.number(),
    awards: z.array(z.string()).default([]),
    images: z.object({
      hero: z.string(),
      process: z.array(z.object({
        img: z.string(),
        caption: z.string(),
      })),
      final: z.string(),
    }),
  }),
});

export const collections = { projects };
