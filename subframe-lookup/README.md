# SUBFORM — subframe fitment lookup (concept)

Concept site for a client who sells automotive subframes: enter a car registration and see which subframe that vehicle takes.

## Run locally

```bash
cd subframe-lookup
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What this concept does

1. **Demo plate lookup** — plates like `ABC123`, `XYZ987`, `WRX44` map to vehicles in a local fitment table, then to subframe SKUs.
2. **Manual make / model / years** — same catalogue without a plate.
3. **VIN (optional)** — 17-character VINs call the free [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/) decoder and try to map onto the concept catalogue.

There is **no paid AU/NZ/UK rego API** wired yet. Those need commercial keys. Production path:

`rego API → make/model/year/series → subframe SKU table → product / enquire`

## Demo plates

| Plate   | Vehicle              |
|---------|----------------------|
| ABC123  | Toyota Hilux N80    |
| XYZ987  | Ford Ranger PX       |
| NEXT22  | Ford Ranger Next-Gen |
| WRX44   | Subaru WRX VA        |
| GOLF7   | VW Golf Mk7          |
| VE334   | Holden Commodore VE/VF |
| COR2020 | Toyota Corolla E210  |
| NAV300  | Nissan Navara D23    |
| BT5011  | Mazda BT-50          |
| TRI19   | Mitsubishi Triton MR |
| BMW330  | BMW 3 Series F30     |
| N70OLD  | Toyota Hilux N70    |

## Stack

Vite · React · TypeScript
