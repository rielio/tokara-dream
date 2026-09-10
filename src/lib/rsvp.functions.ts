import { createServerFn } from "@tanstack/react-start";
import { rsvpSchema } from "./rsvp.schema";

const RSVP_RECIPIENT = "caras24@icloud.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RSVP_FROM_EMAIL;

    if (!resendApiKey || !fromEmail) {
      console.error("[rsvp] RESEND_API_KEY or RSVP_FROM_EMAIL is not configured");
      throw new Error("The RSVP email service is not configured yet. Please try again later.");
    }

    const names = (data.guestNames ?? []).map((n) => n.trim()).filter(Boolean);

    const guestNamesHtml = names.length
      ? `<p><strong>Additional guests:</strong> ${escapeHtml(names.join(", "))}</p>`
      : "";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [RSVP_RECIPIENT],
        reply_to: data.email,
        subject: `Wedding RSVP — ${data.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2d2d2d">
            <h2>New Wedding RSVP</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
            <p><strong>Attendance:</strong> ${data.attending ? "Joyfully Accept" : "Regretfully Decline"}</p>
            <p><strong>Number of guests:</strong> ${data.guests}</p>
            ${guestNamesHtml}
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      console.error("[rsvp] email notification failed", details);
      throw new Error("We couldn't send your reply. Please try again.");
    }

    return { ok: true };
  });
