import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SlotDashboardIdChartIdCompoundUniqueInputObjectSchema as SlotDashboardIdChartIdCompoundUniqueInputObjectSchema } from './SlotDashboardIdChartIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  dashboardId_chartId: z.lazy(() => SlotDashboardIdChartIdCompoundUniqueInputObjectSchema).optional()
}).strict().superRefine((obj, ctx) => {
        const presentTop = (k: string) => (obj as any)[k] != null;
        const singles: string[] = [] as string[];
        const groups: string[][] = [["dashboardId","chartId"]] as string[][];

        const anySingle = Array.isArray(singles) && singles.length > 0 ? singles.some(presentTop) : false;

        let anyComposite = false;
        if (Array.isArray(groups) && groups.length > 0) {
          // Iterate over nested composite selectors (e.g., { composite_key_name: { a: ..., b: ... } })
          for (const [propKey, composite] of Object.entries(obj as Record<string, unknown>)) {
            if (!composite || typeof composite !== 'object') continue;
            for (const g of groups as string[][]) {
              if (!Array.isArray(g) || g.length === 0) continue;
              const presentInComposite = (k: string) => (composite as any)[k] != null;
              const provided = (g as string[]).filter(presentInComposite).length;
              if (provided > 0 && provided < g.length) {
                for (const f of g as string[]) {
                  if (!presentInComposite(f)) {
                    ctx.addIssue({ code: 'custom', message: 'All fields of composite unique must be provided', path: [propKey, f] });
                  }
                }
              }
              if (provided === g.length && g.length > 0) {
                anyComposite = true;
              }
            }
          }
        }

        if (!anySingle && !anyComposite) {
          ctx.addIssue({ code: 'custom', message: 'Provide at least one unique selector' });
        }
      });
export const SlotWhereUniqueInputObjectSchema: z.ZodType<Prisma.SlotWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SlotWhereUniqueInput>;
export const SlotWhereUniqueInputObjectZodSchema = makeSchema();
