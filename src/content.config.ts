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
    range: z.tuple([z.number(), z.number()]).nullable(),  // [minUSD, maxUSD] — null = a confirmar
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
const safeUrl = z.string().url().refine((val) => {
  try {
    const url = new URL(val);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}, { message: 'URL must use http or https protocol' });

const checklistCategorySchema = z.object({
  id: z.enum([
    'transporte',
    'alojamiento',
    'actividades',
    'ropa',
    'documentacion',
    'conectividad',
    'utilidades',
    'camping',
  ]),
  order: z.number().int().nonnegative(),
  label: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      note: z.string().optional(),
      link: safeUrl.optional(),
    })
  ),
});

// ── Budget Item ──────────────────────────────────────────────────────────────
const budgetItemSchema = z.object({
  id: z.string(),
  cat: z.enum(['flight', 'transfer', 'insurance', 'activity']),
  label: z.string(),
  date: z.string().optional(),
  perPerson: z.boolean().default(true),
  range: z.tuple([z.number(), z.number()]).nullable(),
  critical: z.boolean().default(false),
  free: z.boolean().default(false),
  destSlug: z.string().nullable().default(null),
});

// ── Booking ──────────────────────────────────────────────────────────────────
const bookingSchema = z.object({
  id: z.string(),
  category: z.enum(['flight', 'accommodation', 'transfer', 'activity', 'rental']),
  title: z.string(),
  urgency: z.enum(['alta-ya', 'alta-3-6m', 'media', 'baja']),
  status: z.enum(['pendiente', 'reservado', 'pagado']),
  cost: z
    .object({
      amount: z.number().positive(),
      currency: z.enum(['USD', 'ARS', 'CLP', 'UYU']),
      perPerson: z.boolean().default(false),
    })
    .optional(),
  deadline: z.string().date().optional(),
  link: safeUrl.optional(),
  notes: z.string().optional(),
  destination: z.string().optional(),
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
  bookings: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/bookings' }),
    schema: bookingSchema,
  }),
  'budget-items': defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/budget-items' }),
    schema: budgetItemSchema,
  }),
};
