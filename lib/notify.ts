/**
 * Outbound notifications for the lead forms.
 *
 * Every form does two things: tell CRAFT a lead came in, and tell the
 * person who filled it in that we got it. Those have very different
 * failure semantics, which is why they live behind separate functions:
 *
 *   - The internal notification is the point of the request. If it fails,
 *     the request fails and the visitor is told to try again.
 *   - The confirmation is a courtesy. If it fails, the lead is still safely
 *     in CRAFT's inbox, so we log and move on rather than showing an error
 *     for something that already succeeded.
 *
 * Nothing here throws. Callers get a result object instead.
 */
import { siteUrl, siteConfig, exploreLinks } from "@/lib/site-config";

const POSTMARK_ENDPOINT = "https://api.postmarkapp.com/email";

/* Postmark has no shared sandbox sender the way Resend did, so there is no
   generic address to fall back to: From has to be one Postmark has verified
   for this domain. Defaulting to the company's own address means an
   unverified setup fails loudly with Postmark's "sender signature not
   confirmed" instead of quietly sending from a provider's domain. */
const FROM =
  process.env.CHARTER_FROM_EMAIL ?? `CRAFT <${siteConfig.contactEmail}>`;

/* Resend took { filename, content }. Postmark wants { Name, Content,
   ContentType } and will not guess the type. Everything attached today is a
   generated PDF, so the extension is enough to name it. */
const ATTACHMENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
};

function toPostmarkAttachment(a: { filename: string; content: string }) {
  const ext = a.filename.split(".").pop()?.toLowerCase() ?? "";
  return {
    Name: a.filename,
    Content: a.content,
    ContentType: ATTACHMENT_TYPES[ext] ?? "application/octet-stream",
  };
}

/**
 * `skipped` is present on every variant so callers can branch on it without
 * first narrowing on `ok` — the common check is "did this actually fail, as
 * opposed to never being attempted?", i.e. `!ok && !skipped`.
 */
export type SendResult =
  | { ok: true; skipped: false }
  /** Never attempted: not configured, throttled, or no usable address. */
  | { ok: false; skipped: true; reason: string }
  /** Attempted and failed. */
  | { ok: false; skipped: false; reason: string };

/* ------------------------------------------------------------------ */
/* Escaping + validation                                               */
/* ------------------------------------------------------------------ */

/**
 * Everything a visitor typed gets escaped before it lands in an HTML
 * email. Without this, a message body containing markup would render as
 * live HTML in the recipient's client — and the confirmation email goes to
 * an address the *sender* chose, so that markup would be attacker-supplied
 * content delivered under CRAFT's name.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Deliberately conservative: one @, no whitespace, a dotted domain. */
export function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Best-effort E.164. Returns null when the input can't be normalised with
 * confidence — better to skip the SMS than to text a stranger whose number
 * happens to be what a typo resolved to.
 */
export function toE164(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`; // bare US/Canada number
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/* ------------------------------------------------------------------ */
/* Abuse throttle                                                      */
/* ------------------------------------------------------------------ */

/**
 * The confirmation is the one email on the site sent to an address the
 * caller supplies, which makes it the one endpoint that could be pointed
 * at a third party. Escaping stops the content being controlled; this caps
 * the volume, so the form can't be used to repeatedly mail someone.
 *
 * In-memory, so on serverless this is per-instance and therefore
 * best-effort only: it blunts a naive loop, not a distributed one. A
 * durable limit needs a shared store (Vercel KV / Upstash).
 */
const RECENT = new Map<string, number>();
const THROTTLE_MS = 10 * 60 * 1000; // one confirmation per address per 10 min
const MAX_TRACKED = 5000;

function throttled(key: string): boolean {
  const now = Date.now();
  if (RECENT.size > MAX_TRACKED) {
    for (const [k, t] of RECENT) if (now - t > THROTTLE_MS) RECENT.delete(k);
  }
  const last = RECENT.get(key);
  if (last !== undefined && now - last < THROTTLE_MS) return true;
  RECENT.set(key, now);
  return false;
}

/**
 * Who a lead goes to. CHARTER_TO_EMAIL may list several addresses separated
 * by commas, which is how the site routes to more than one inbox during the
 * review period without a code change.
 */
export function leadRecipients(): string[] {
  const raw = process.env.CHARTER_TO_EMAIL ?? "nivtesler8@gmail.com";
  return raw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Transport                                                           */
/* ------------------------------------------------------------------ */

type MailArgs = {
  /** One address, or several — deduped case-insensitively before sending. */
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
};

export async function sendMail(args: MailArgs): Promise<SendResult> {
  /* Dedupe by lowercased address but keep the original casing: a programme's
     own recipients can overlap the general inbox, and nobody wants two copies
     of the same lead. */
  const seen = new Set<string>();
  const to = (Array.isArray(args.to) ? args.to : [args.to])
    .map((a) => a.trim())
    .filter((a) => a && !seen.has(a.toLowerCase()) && seen.add(a.toLowerCase()));

  if (to.length === 0) {
    return { ok: false, skipped: true, reason: "no recipients" };
  }

  const serverToken = process.env.POSTMARK_SERVER_TOKEN;
  if (!serverToken) {
    console.log(
      `--- Email not configured (POSTMARK_SERVER_TOKEN unset) ---\nTo: ${to.join(", ")}\nSubject: ${args.subject}\n\n${args.text}`
    );
    return { ok: false, skipped: true, reason: "POSTMARK_SERVER_TOKEN unset" };
  }
  try {
    const res = await fetch(POSTMARK_ENDPOINT, {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": serverToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        From: FROM,
        /* One comma-separated string rather than an array, capped at 50
           recipients per message. The dedupe above keeps us well under. */
        To: to.join(", "),
        Subject: args.subject,
        TextBody: args.text,
        /* The default transactional stream. Postmark rejects the send if
           this names a stream the server does not have. */
        MessageStream: "outbound",
        ...(args.html ? { HtmlBody: args.html } : {}),
        ...(args.replyTo ? { ReplyTo: args.replyTo } : {}),
        ...(args.attachments
          ? { Attachments: args.attachments.map(toPostmarkAttachment) }
          : {}),
      }),
    });
    if (!res.ok) {
      /* Postmark puts an ErrorCode and a human-readable Message in the body
         (406 = recipient suppressed, 300 = sender signature unverified), so
         the body is worth more than the status on its own. */
      const detail = await res.text();
      console.error("Postmark error:", res.status, detail);
      return { ok: false, skipped: false, reason: `Postmark ${res.status}` };
    }
    return { ok: true, skipped: false };
  } catch (err) {
    console.error("Postmark request threw:", err);
    return { ok: false, skipped: false, reason: "network" };
  }
}

/**
 * Twilio, gated entirely on its three env vars being present. Unset means
 * "SMS not enabled" rather than an error — email is the primary channel
 * and a missing SMS credential must never fail a form submission.
 */
export async function sendSms(to: string, body: string): Promise<SendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    return { ok: false, skipped: true, reason: "Twilio not configured" };
  }
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      }
    );
    if (!res.ok) {
      console.error("Twilio error:", res.status, await res.text());
      return { ok: false, skipped: false, reason: `Twilio ${res.status}` };
    }
    return { ok: true, skipped: false };
  } catch (err) {
    console.error("Twilio request threw:", err);
    return { ok: false, skipped: false, reason: "network" };
  }
}

/* ------------------------------------------------------------------ */
/* Confirmation template                                               */
/* ------------------------------------------------------------------ */

const NAVY = "#0C1D3D";
const INK2 = "#4A5A73";
const INK3 = "#8494A8";
const BORDER = "#E3EAF2";

const EXPLORE = exploreLinks;

export type SummaryRow = { label: string; value: string };

/** A single free-text field can't be allowed to balloon the email. */
const CAP = 2000;
const cap = (v: string) => (v.length > CAP ? `${v.slice(0, CAP)}…` : v);

function buildHtml(name: string, lead: string, rows: SummaryRow[]): string {
  const safeRows = rows
    .filter((r) => r.value && r.value.trim() && r.value.trim() !== "—")
    .map(
      (r) => `
        <tr>
          <td style="padding:10px 0;border-top:1px solid ${BORDER};font:400 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:0.14em;text-transform:uppercase;color:${INK3};width:38%;vertical-align:top;">${escapeHtml(r.label)}</td>
          <td style="padding:10px 0;border-top:1px solid ${BORDER};font:300 14px/1.6 Helvetica,Arial,sans-serif;color:${NAVY};vertical-align:top;white-space:pre-wrap;">${escapeHtml(cap(r.value.trim()))}</td>
        </tr>`
    )
    .join("");

  const buttons = EXPLORE.map(
    (l) => `
      <td style="padding:0 6px 10px 0;">
        <a href="${siteUrl}${l.href}" style="display:inline-block;padding:12px 20px;border:1px solid ${BORDER};border-radius:999px;font:500 11px/1 Helvetica,Arial,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:${NAVY};text-decoration:none;">${escapeHtml(l.label)}</a>
      </td>`
  ).join("");

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6FAFC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;padding:40px;">
        <tr><td align="center" style="font:600 15px/1 Helvetica,Arial,sans-serif;letter-spacing:0.34em;text-indent:0.17em;text-align:center;color:${NAVY};padding-bottom:28px;">CRAFT</td></tr>

        <tr><td style="font:300 26px/1.25 Helvetica,Arial,sans-serif;color:${NAVY};padding-bottom:14px;">We&rsquo;ve received your ${escapeHtml(lead)}.</td></tr>

        <tr><td style="font:300 15px/1.7 Helvetica,Arial,sans-serif;color:${INK2};padding-bottom:8px;">
          ${escapeHtml(name)}, thank you. A member of our team will reach back within the next 24 hours.
        </td></tr>
        <tr><td style="font:300 15px/1.7 Helvetica,Arial,sans-serif;color:${INK2};padding-bottom:30px;">
          If it&rsquo;s urgent, call Charter Sales on
          <a href="tel:${siteConfig.charterSalesPhone}" style="color:${NAVY};">${siteConfig.charterSalesPhoneDisplay}</a>.
        </td></tr>

        ${
          safeRows
            ? `<tr><td style="font:400 10px/1 Helvetica,Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;color:${INK3};padding-bottom:6px;">What you sent us</td></tr>
               <tr><td style="padding-bottom:30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${safeRows}</table></td></tr>`
            : ""
        }

        <tr><td style="font:400 10px/1 Helvetica,Arial,sans-serif;letter-spacing:0.3em;text-transform:uppercase;color:${INK3};padding-bottom:14px;">In the meantime</td></tr>
        <tr><td><table role="presentation" cellpadding="0" cellspacing="0"><tr>${buttons}</tr></table></td></tr>

        <tr><td align="center" style="padding-top:30px;border-top:1px solid ${BORDER};font:300 12px/1.6 Helvetica,Arial,sans-serif;text-align:center;color:${INK3};">
          CRAFT &middot; ${escapeHtml(siteConfig.address)}<br>
          This is an automated confirmation. Replying to it reaches our team.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(name: string, lead: string, rows: SummaryRow[]): string {
  const body = rows
    .filter((r) => r.value && r.value.trim() && r.value.trim() !== "—")
    .map((r) => `${r.label}: ${cap(r.value.trim())}`);
  return [
    `CRAFT`,
    ``,
    `We've received your ${lead}.`,
    ``,
    `${name}, thank you. A member of our team will reach back within the next 24 hours.`,
    `If it's urgent, call Charter Sales on ${siteConfig.charterSalesPhoneDisplay}.`,
    ...(body.length ? [``, `What you sent us`, ``, ...body] : []),
    ``,
    `In the meantime:`,
    ...EXPLORE.map((l) => `  ${l.label}: ${siteUrl}${l.href}`),
    ``,
    `CRAFT · ${siteConfig.address}`,
    `This is an automated confirmation. Replying to it reaches our team.`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                  */
/* ------------------------------------------------------------------ */

export type ConfirmationArgs = {
  /** What they submitted, lowercase, used mid-sentence: "charter request". */
  lead: string;
  name: string;
  email?: string;
  phone?: string;
  /** Echoed back under "What you sent us". Blank and "—" rows are dropped. */
  summary?: SummaryRow[];
  /** Their own copy of anything generated from the submission (the PDF). */
  attachments?: { filename: string; content: string }[];
};

/**
 * Fire-and-forget acknowledgement to the person who filled the form in.
 * Email is the primary channel; SMS only goes out when the number can be
 * normalised AND Twilio is configured, and never as a substitute for a
 * failed email — the two are independent.
 *
 * Resolves with what happened on each channel. Never rejects.
 */
export async function sendConfirmation(args: ConfirmationArgs): Promise<{
  email: SendResult;
  sms: SendResult;
}> {
  const name = String(args.name ?? "").trim() || "there";
  const rows = args.summary ?? [];

  let email: SendResult = { ok: false, skipped: true, reason: "no email given" };
  if (isEmail(args.email)) {
    const to = args.email.trim();
    if (throttled(`email:${to.toLowerCase()}`)) {
      email = { ok: false, skipped: true, reason: "throttled" };
    } else {
      email = await sendMail({
        to,
        subject: `CRAFT: we've received your ${args.lead}`,
        text: buildText(name, args.lead, rows),
        html: buildHtml(name, args.lead, rows),
        replyTo: siteConfig.contactEmail,
        ...(args.attachments ? { attachments: args.attachments } : {}),
      });
    }
  }

  let sms: SendResult = { ok: false, skipped: true, reason: "no usable phone" };
  const e164 = toE164(args.phone);
  if (e164) {
    if (throttled(`sms:${e164}`)) {
      sms = { ok: false, skipped: true, reason: "throttled" };
    } else {
      sms = await sendSms(
        e164,
        `CRAFT: we've received your ${args.lead}. Our team will reach back within 24 hours. Urgent? Call ${siteConfig.charterSalesPhoneDisplay}.`
      );
    }
  }

  return { email, sms };
}

