// Config Schema & Validation for Build-A-Biz App Generator
import { z } from "zod";

export const configSchema = z.object({
  meta: z.object({
    businessName: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    tagline: z.string().optional(),
    description: z.string().max(500).optional(),
    template: z.enum(["modern-minimal", "casual-diner", "urban-izakaya", "fast-casual", "artisan-bakery"]),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      dark: z.boolean().default(false),
    }),
    fonts: z.object({
      heading: z.string().default("Inter"),
      body: z.string().default("Inter"),
    }).optional(),
    contact: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
    }),
  }),

  menu: z.object({
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().positive(),
        description: z.string().optional(),
        image: z.string().optional(),
      })),
    })),
  }),

  integrations: z.object({
    stripe: z.object({
      publishableKey: z.string().startsWith("pk_"),
    }),
    uberEats: z.object({ enabled: z.boolean().default(false) }).optional(),
    doorDash: z.object({ enabled: z.boolean().default(false) }).optional(),
    credWallet: z.object({ enabled: z.boolean().default(false) }).optional(),
  }),

  loyalty: z.object({
    enabled: z.boolean().default(true),
    pointsName: z.string().default("Points"),
    earnRate: z.number().default(1),
    tiers: z.array(z.object({
      name: z.string(),
      threshold: z.number(),
      multiplier: z.number().default(1),
    })).optional(),
  }).optional(),

  giftCards: z.object({
    enabled: z.boolean().default(true),
    denominations: z.array(z.number()).default([10, 25, 50, 100]),
  }).optional(),
});

export type AppConfig = z.infer<typeof configSchema>;
