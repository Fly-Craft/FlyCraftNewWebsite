# Deploying to Vercel

Route: **GitHub → Vercel import**, so every future `git push` redeploys
automatically and each branch gets its own preview URL.

Verified before writing this: production build passes (27 routes), all 36
referenced assets exist in `public/`, no files large enough to trouble
GitHub (largest is 2.2 MB), and no symlinks in `public/`.

---

## ⚠️ Read this first: forms fail silently without an email key

If `RESEND_API_KEY` is not set in Vercel, every form on the live site
(charter request, contact, corporate, management) will show the visitor a
success message and then **discard the submission**. The request is only
written to the Vercel function log. The PDF-to-disk fallback is correctly
skipped on Vercel, since serverless filesystems are read-only.

So: set the env vars *before* sending anyone to the live URL.

You need a [Resend](https://resend.com) account and an API key. Until
`flycraft.com` is verified as a sending domain in Resend, leave
`CHARTER_FROM_EMAIL` unset — the code falls back to Resend's shared
`onboarding@resend.dev` sender, which works immediately for testing.

---

## 1. Create the GitHub repo

Make a new **private** repo at <https://github.com/new>. Don't let it add
a README, .gitignore, or licence — this repo already has history.

Then, with `<you>` and `<repo>` filled in:

```bash
git -C "/Users/nivtesler/Claude Code/craft-website" remote add origin git@github.com:<you>/<repo>.git
```

```bash
git -C "/Users/nivtesler/Claude Code/craft-website" push -u origin main --tags
```

`--tags` carries the `design-v1` backup tag up with it, so the pre-redesign
snapshot lives off this machine too.

## 2. Import into Vercel

At <https://vercel.com/new>, pick the repo. Vercel detects Next.js on its
own — framework, build command, and output directory all need no changes.

**Before clicking Deploy**, open *Environment Variables* and add:

| Name | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | your Resend key | Required, or forms silently discard |
| `CHARTER_TO_EMAIL` | `nivtesler8@gmail.com` | Where submissions land |
| `CHARTER_FROM_EMAIL` | *leave unset for now* | Set to `CRAFT <charter@flycraft.com>` once flycraft.com is verified in Resend |

Apply them to Production, Preview, and Development.

## 3. Verify the live site

Once the deploy finishes, on the `*.vercel.app` URL:

- Submit a real charter request and confirm the email arrives with the
  PDF attached. This is the only check that proves the env vars took.
- Load `/fleet/menu` and confirm all snack images render.
- Scroll the home hero on a phone — the plane, then the map with the
  flight tally underneath.
- Confirm the floating **Book Now** button appears on every page except
  the landing page and `/charter`.

## 4. Custom domain

Vercel → project → *Settings* → *Domains* → add `flycraft.com`, then
create the DNS records Vercel shows you at your registrar. HTTPS is
issued automatically once DNS resolves.

---

## Switching the form recipient later

It's an env var, not a code change: Vercel → *Settings* → *Environment
Variables* → edit `CHARTER_TO_EMAIL` → redeploy. The address in the
footer and on the contact page is separate — that one lives in
`lib/site-config.ts`.
