import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Syllabus Row ID, the join key to the Master Syllabus sheet (e.g. M4-L1.2).
const rowId = z.string().regex(/^M\d-L\d+\.\d+$/, 'Row IDs look like M4-L1.2');

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        row: rowId.optional(),
        // Pages that cover several syllabus rows list all of them; `row` is the primary one.
        rows: z.array(rowId).optional(),
      }),
    }),
  }),
};
