import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  attending: z.boolean(),
  guests: z.number().int().min(1).max(6),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("rsvps").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      attending: data.attending,
      guests: data.guests,
    });

    if (error) {
      console.error("[rsvp] insert failed", error.message);
      throw new Error("We couldn't save your reply. Please try again.");
    }

    return { ok: true };
  });
