# Deploying

## Where things live

- **Code:** GitHub, `Fly-Craft/FlyCraftNewWebsite`. It moved there from
  `nivteslercraft` on 4 September 2026; the old address redirects, but new
  clones should use the new one.
- **Hosting:** Vercel, project `craft-website` on the `craft-charter` team,
  connected to the repo through Vercel's GitHub integration. Every push to
  `main` builds and deploys to production on its own; any other branch gets
  a preview URL.
- **Production URL:** `craft-website-tau.vercel.app` until `flycraft.com`
  is pointed at it (see Custom domain below).

Fresh clone:

```bash
git clone git@github.com:Fly-Craft/FlyCraftNewWebsite.git
```

An existing clone that still points at the old owner:

```bash
git remote set-url origin git@github.com:Fly-Craft/FlyCraftNewWebsite.git
```

## Shipping a change

Build locally first, so type errors surface here rather than in a failed
Vercel build, then commit and push `main`:

```bash
npm run build
```

If more than one person pushes, run `git fetch` and check you are not
behind `origin/main` before committing.

## Environment variables

Set in Vercel under *Settings → Environment Variables*, for Production,
Preview and Development.

| Name | Purpose |
|---|---|
| `POSTMARK_SERVER_TOKEN` | Required. Without it every form shows the visitor a success screen and only writes the submission to the function log. |
| `CHARTER_TO_EMAIL` | Comma-separated review list that receives every form. Trip requests and contact messages additionally go to `charter@flycraft.com`; that rule lives in code, `charterDeskRecipients()` in `lib/notify.ts`, not here. |
| `CHARTER_FROM_EMAIL` | Optional. Defaults to `CRAFT <charter@flycraft.com>`; `flycraft.com` is verified in Postmark. |
| `SITE_PUBLIC` | Set to `true` at launch. Until then every page is served with `noindex`, and programme enquiries go to the review list only. |

SMS confirmations through Twilio exist in the code but are switched off.
Do not set the Twilio variables until the forms carry an explicit consent
checkbox; see the legal notes.

## Verifying a deploy

- Submit the contact form on the live URL and confirm the email arrives on
  the review list and at `charter@flycraft.com` with the PDF attached. This
  is the only check that proves the mail variables took.
- Scroll the home hero on a phone and with a mouse wheel: the plane, then
  the map with the flight tally underneath, with no jumps.
- Open the home page on a wide monitor: the content stays a centred
  1536px column and the photos do not drift away from their text.

## Custom domain

Vercel → project → *Settings → Domains* → add `flycraft.com`, then create
the DNS records Vercel shows you at the registrar. HTTPS is issued
automatically once DNS resolves.

## Changing the review list later

Edit `CHARTER_TO_EMAIL` in Vercel and redeploy. The address shown in the
footer and on the contact page is separate and lives in
`lib/site-config.ts`.
