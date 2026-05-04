import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Destination ──────────────────────────────────────────────────────────────
const destinationSchema = z.object({
  slug: z.string(),
  order: z.number().int().nonnegative(),
  name: z.string(),
  country: z.enum(['AR', 'CL', 'UY']),
  coords: z.tuple([z.number(), z.number()]),   // [lon, lat]
  startDate: z.string(),                        // human "21 nov" — display only
  endDate: z.string(),
  nights: z.number().int().nonnegative(),
  summary: z.string(),
  activities: z.array(
    z.object({
      title: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      hours: z.number().positive(),
    })
  ),
  stay: z.object({
    type: z.string(),
    range: z.tuple([z.number(), z.number()]),  // [minUSD, maxUSD]
  }),
  out: z.string(),
});

// ── Day ──────────────────────────────────────────────────────────────────────
const daySchema = z.object({
  date: z.string(),            // "21 nov"
  dest: z.string(),            // destination slug ref
  main: z.string(),
  transfer: z.string().nullable(),
  critical: z.boolean().default(false),
  note: z.string().optional(),
});

// ── Route ────────────────────────────────────────────────────────────────────
const routeSchema = z.object({
  id: z.string(),
  from: z.string(),            // destination slug
  to: z.string(),
  mode: z.enum(['bus', 'plane', 'ferry', 'car', 'walk']),
  coords: z.array(z.tuple([z.number(), z.number()])).min(2),  // [[lon,lat], ...]
  curved: z.boolean().optional(),
});

// ── Checklist Category ───────────────────────────────────────────────────────
const checklistCategorySchema = z.object({
  id: z.enum([
    'transporte',
    'alojamiento',
    'actividades',
    'ropa',
    'documentacion',
    'conectividad',
    'utilidades',
  ]),
  order: z.number().int().nonnegative(),
  label: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      note: z.string().optional(),
      link: z.string().url().optional(),
    })
  ),
});

export const collections = {
  destinations: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/destinations' }),
    schema: destinationSchema,
  }),
  days: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/days' }),
    schema: daySchema,
  }),
  routes: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/routes' }),
    schema: routeSchema,
  }),
  'checklist-items': defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/checklist-items' }),
    schema: checklistCategorySchema,
  }),
};
