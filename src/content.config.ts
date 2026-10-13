import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/projects' }),
  // Images live next to each index.md (e.g. "./cover.jpg") so Astro can optimize them at build time.
  schema: ({ image }) => {
    // An image entry can be a plain path, or an object with position/fit/caption overrides.
    const simpleImage = z.union([
      image(),
      z.object({
        img: image(),
        position: z.string().optional(),
        fit: z.enum(['cover', 'contain']).optional(),
        caption: z.string().optional(),
      }),
    ]);

    const processImage = z.object({
      img: image(),
      caption: z.string(),
      position: z.string().optional(),
      fit: z.enum(['cover', 'contain']).optional(),
    });

    return z.object({
      title: z.string(),
      tags: z.array(z.string()),
      year: z.string(),
      studio: z.string(),
      instructor: z.string(),
      partner: z.string().default('—'),
      location: z.string().default('—'),
      processCols: z.number().default(3),
      order: z.number(),
      // Catalogue chapter; the catalogue number (e.g. "C-02") is derived from chapter + order.
      chapter: z.enum(['parts', 'combination', 'adaptation', 'time', 'misc']),
      // One line each for the sheet's title block: the module, how it combines, what it answers to.
      unit: z.string().default('—'),
      rule: z.string().default('—'),
      context: z.string().default('—'),
      awards: z.array(z.string()).default([]),
      images: z.object({
        hero: simpleImage,
        process: z.array(processImage),
        final: z.union([simpleImage, z.array(simpleImage)]),
      }),
    });
  },
});

export const collections = { projects };
