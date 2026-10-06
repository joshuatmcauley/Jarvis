# Euro Subframes — UK plate → subframe fitment

Concept site for a UK / European subframe supplier: customer enters a **UK registration**, we identify the vehicle, and show which subframe SKU it takes.

## Quick start (demo mode — no API keys)

```bash
cd subframe-lookup
npm install
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:8787  

Try demo plates: `AB12CDE` (Golf Mk7), `BK15XYZ` (BMW F30), `MF64AUD` (Audi A3), `LN11FRD` (Focus).

## Make it live (accurate UK data)

You need free government API access (register once; keys can take a few working days):

1. **DVLA Vehicle Enquiry** — [developer portal](https://developer-portal.driver-vehicle-licensing.api.gov.uk/) → `DVLA_API_KEY`
2. **DVSA MOT history** (gives **model** — important) — [register](https://documentation.history.mot.api.gov.uk/mot-history-api/register) → `MOT_CLIENT_ID`, `MOT_CLIENT_SECRET`, `MOT_API_KEY`, `MOT_TOKEN_URL`

```bash
cp .env.example .env
# paste keys into .env
npm run dev
```

Flow when keys are present:

`UK VRM → DVLA + MOT → make/model/year → shared/fitment.ts → subframe SKUs`

Keys stay on the server only (`server/`). Never put them in the React app.

## Replace placeholder parts with the client’s catalogue

Edit `shared/fitment.ts`:

- `subframes` — real SKUs, names, GBP prices, notes  
- `vehicles` — make / model / year range / chassis → which SKUs  

Until that spreadsheet is in, the site uses a realistic Euro placeholder list (VW, Audi, BMW, Mercedes, Ford, Vauxhall, MINI, Skoda, Seat).

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | API + Vite together |
| `npm run dev:api` | API only on :8787 |
| `npm run dev:web` | Frontend only (proxies `/api` → :8787) |
| `npm run build` | Production frontend build |

## What you still need to send

1. DVLA + MOT keys in `.env` (after GOV.UK registration)  
2. Client’s real subframe SKU / fitment spreadsheet (to replace placeholders)
