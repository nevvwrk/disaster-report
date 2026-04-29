import { z } from 'zod'
import { DisasterType, Severity } from '../../generated/prisma/enums';

export const reportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(1),
  disasterType: z.enum(DisasterType),
  latitude: z.number(),
  longitude: z.number(),
  area: z.string().min(1),
  imageUrl: z.array(z.string()).optional(),
  severity: z.enum(Severity),
  tel: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal(""))
})