# Host The Tidy Bee in the cloud (no Pi)

Fastest option is **Vercel**. Free for this kind of site. Then attach the domain you bought.

## Vercel (do this)

1. Merge or use branch `cursor/tidy-bee-website-c4d5` on GitHub: https://github.com/joshuatmcauley/Jarvis
2. Open https://vercel.com/new and sign in with GitHub.
3. Import **Jarvis**.
4. Set **Root Directory** to `tidy-bee` (important — the site is not at the repo root).
5. Leave the rest as Vite defaults (build `npm run build`, output `dist`).
6. Deploy. You get a URL like `https://something.vercel.app`.

### Attach your purchased domain

In the Vercel project: **Settings → Domains → Add**.

Vercel will show DNS records. At the shop where you bought the domain, create what they ask for, usually:

- **Apex** (`yourdomain.com`): `A` record to `76.76.21.21`  
  or a CNAME flattening record if the registrar supports it
- **www**: `CNAME` to `cname.vercel-dns.com`

Wait 5–30 minutes. HTTPS is automatic.

## GitHub Pages (no extra account)

After this workflow has run at least once:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. Site URL: https://joshuatmcauley.github.io/Jarvis/

To use your own domain on Pages instead, add it in that same Pages settings screen and keep `BASE_PATH` as `/` (ask if you want that switched).

## Netlify

Same idea as Vercel: import the GitHub repo, base directory `tidy-bee`, publish `dist`.
