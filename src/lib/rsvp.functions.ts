import { createServerFn } from "@tanstack/react-start";
import { rsvpSchema } from "./rsvp.schema";

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const names = (data.guestNames ?? []).map((n) => n.trim()).filter(Boolean);

    const { error } = await supabaseAdmin.from("rsvps").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      attending: data.attending,
      guests: data.guests,
      guest_names: names.length ? names.join(", ") : null,
    });

    if (error) {
      console.error("[rsvp] insert failed", error.message);
      throw new Error("We couldn't save your reply. Please try again.");
    }

    return { ok: true };
  });
