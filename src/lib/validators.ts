import { z } from 'zod'

export const reportSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  disasterType: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  area: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
  severity: z.enum(['LOW','MEDIUM','HIGH']),
  tel: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal(""))
})