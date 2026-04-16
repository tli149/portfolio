import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// An image entry can be a plain filename string, or an object with position/fit overrides.
const simpleImage = z.union([
  z.string(),
  z.object({
    img: z.string(),
    position: z.string().optional(),
    fit: z.enum(['cover', 'contain']).optional(),
  }),
]);

const processImage = z.object({
  img: z.string(),
  caption: z.string(),
  position: z.string().optional(),
  fit: z.enum(['cover', 'contain']).optional(),
});

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
      hero: simpleImage,
      process: z.array(processImage),
      final: z.union([simpleImage, z.array(simpleImage)]),
    }),
  }),
});

export const collections = { projects };
