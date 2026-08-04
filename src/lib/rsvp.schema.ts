import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  attending: z.boolean(),
  guests: z.number().int().min(1).max(6),
  guestNames: z.array(z.string().trim().max(100)).max(5).optional().default([]),
});

export type RsvpInput = z.input<typeof rsvpSchema>;
