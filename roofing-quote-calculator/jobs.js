/* Calculators for bcmckeown.net.
   Prices are ex VAT (website price ÷ 1.2).
   A product is here only when a measurement changes how many you buy,
   or the site sells it by the metre or the square metre.
   Whole pieces are counted. They are not priced as if they were cut shorter.
   Gates, sheds, gate posts, V mesh kits, fence bay kits, and anything
   sold only as one finished item stay in the product list. */
const JOBS = [
  {
    id: "roof",
    name: "Roofing sheets",
    blurb: "Box and tile are cut to length. Sandwich and clear sheets round up to a stock length.",
    mode: "roof",
    products: [],
  },
  {
    id: "decking",
    name: "Composite decking",
    blurb: "3.6m boards, 140mm cover, £24 inc VAT each.",
    mode: "area",
    wasteDefault: 10,
    note: "Boards are sold whole at 3.6m. This counts how many boards cover the deck. A shorter gap does not get a cheaper, cut board. Length is the way the boards run. Width is across them.",
    products: [
      {
        id: "deck-board",
        name: "Hollow decking board",
        lengthM: 3.6,
        coverM: 0.14,
        price: 20,
        note: "3.6m × 140mm cover. £24 inc VAT. The colour is chosen on the next step.",
        colours: [
          { id: "deck-white", name: "Quartz white", hex: "#E4DECC", price: 20 },
          { id: "deck-grey", name: "Woodgrain grey", hex: "#5C6065", price: 20 },
          { id: "deck-dark", name: "Woodgrain dark grey", hex: "#474C50", price: 20 },
          { id: "deck-teak", name: "Woodgrain teak", hex: "#B38B5A", price: 20 },
        ],
      },
    ],
  },
  {
    id: "trim",
    name: "Decking corner trim",
    blurb: "3m lengths, £10 inc VAT each.",
    mode: "perimeter",
    note: "Sold in whole 3m lengths. This counts how many lengths cover the outside edge, 2 × (length + width). A length is not cut to a lower price.",
    products: [
      {
        id: "trim-3",
        name: "WPC 90° corner trim, 3m",
        lengthM: 3,
        price: 8.33,
        note: "£10 inc VAT. Grey, black, and teak are the same price.",
        colours: [
          { id: "trim-grey", name: "Grey", hex: "#5C6065", price: 8.33 },
          { id: "trim-black", name: "Black", hex: "#353C3F", price: 8.33 },
          { id: "trim-teak", name: "Teak", hex: "#845D39", price: 8.33 },
        ],
      },
    ],
  },
  {
    id: "fence-board",
    name: "Composite fence boards",
    blurb: "3.6m tongue and groove boards, 170mm cover, £27.50 inc VAT.",
    mode: "wall",
    wasteDefault: 0,
    note: "Boards are sold whole at 3.6m. Height is stacked in 170mm courses. This does not cut a board down, and it does not include posts, rails, or a ready-made fence bay.",
    products: [
      { id: "fence-tg", name: "Black tongue and groove fence board", lengthM: 3.6, coverM: 0.17, price: 22.92, swatch: "#2A2A2A", note: "3.6m × 170mm cover." },
    ],
  },
  {
    id: "paving",
    name: "Paving",
    blurb: "Slabs from the size printed on the website.",
    mode: "area",
    wasteDefault: 10,
    note: "Slabs are counted whole. They are not cut to a cheaper size. The longer side of the slab runs along the length you enter. The sawn cobble is the one product sold by the square metre. Yellow granite and the 100mm split cobbles have no coverage on the site, so they stay in the product list.",
    products: [
      {
        id: "porc",
        name: "Porcelain paving 800 × 400 × 20mm",
        lengthM: 0.8,
        coverM: 0.4,
        price: 30,
        note: "£36 inc VAT per slab. Light grey and dark grey are the same price.",
        colours: [
          { id: "porc-light", name: "Light grey", hex: "#A4A6A5", price: 30 },
          { id: "porc-dark", name: "Dark grey", hex: "#787B80", price: 30 },
        ],
      },
      {
        id: "gran-900",
        name: "Silver grey granite 900 × 600mm",
        lengthM: 0.9,
        coverM: 0.6,
        swatch: "#C5C7C4",
        note: "£25 inc VAT for 20mm, £36 inc VAT for 30mm, per slab.",
        variants: [
          { id: "gran-900-20", name: "20mm", price: 20.83 },
          { id: "gran-900-30", name: "30mm", price: 30 },
        ],
      },
      { id: "gran-snow", name: "Snow grey granite 600 × 300 × 30mm", lengthM: 0.6, coverM: 0.3, price: 40, swatch: "#D5D6D2", note: "£48 inc VAT per slab on the website." },
      { id: "gran-g603", name: "G603 silver granite 600 × 300 × 30mm", lengthM: 0.6, coverM: 0.3, price: 30, swatch: "#C5C7C4", note: "£36 inc VAT per slab on the website." },
      { id: "cobble-m2", name: "Sawn G603 cobble 200 × 100 × 30mm", priceUnit: "m2", lengthM: 0.2, coverM: 0.1, price: 40, swatch: "#C5C7C4", note: "Website price is £48 inc VAT per square metre (£2.40 inc VAT each)." },
    ],
  },
  {
    id: "kerb",
    name: "Granite kerbs",
    blurb: "Straight kerbs from the run length.",
    mode: "run",
    note: "Kerbs are sold whole. A run uses the next whole kerb. It is not cut to the exact measurement.",
    products: [
      { id: "kerb-g603", name: "G603 silver kerb 1000 × 150 × 90mm", lengthM: 1, price: 20, swatch: "#C5C7C4", note: "£24 inc VAT each." },
      { id: "kerb-split", name: "Natural split kerb 1200 × 225 × 75mm", lengthM: 1.2, price: 30, swatch: "#B7B3A8", note: "£36 inc VAT each." },
      { id: "kerb-natural", name: "Natural granite kerb 900 × 255 × 300mm", lengthM: 0.9, price: 60, swatch: "#A9A59C", note: "£72 inc VAT each." },
    ],
  },
  {
    id: "cladding",
    name: "Composite wall cladding",
    blurb: "Boards from the wall width and height.",
    mode: "wall",
    wasteDefault: 10,
    note: "Pick the board here, then the colour on the next step. Enter the wall you want to cover. A short wall still needs a whole board. The 219mm on the slatted drawing is the panel width, not the size to type in.",
    products: [
      {
        id: "clad-wood",
        name: "Wood grain panel",
        coverM: 0.125,
        price: 10,
        note: "125mm cover. £12 inc VAT. Teak boards are 3m. Grey boards are 2.9m.",
        colours: [
          { id: "clad-teak", name: "Teak", hex: "#9E8465", price: 10, lengthM: 3 },
          { id: "clad-dark", name: "Dark grey", hex: "#2F2F2F", price: 10, lengthM: 2.9 },
          { id: "clad-grey", name: "Grey", hex: "#4C4B47", price: 10, lengthM: 2.9 },
        ],
      },
      {
        id: "clad-slat",
        name: "Slatted cladding",
        lengthM: 3,
        coverM: 0.2,
        price: 20,
        note: "3m long, 200mm cover. £24 inc VAT. £24 is one board, not the 219mm shown on the drawing.",
        colours: [
          { id: "clad-slat-black", name: "Black", hex: "#353C3F", price: 20 },
          { id: "clad-slat-grey", name: "Grey", hex: "#7E8A96", price: 20 },
          { id: "clad-slat-teak", name: "Teak", hex: "#836C55", price: 20 },
          { id: "clad-slat-teak-black", name: "Teak with black centre", hex: "#796148", hex2: "#2F261E", price: 20 },
        ],
      },
    ],
  },
  {
    id: "steps",
    name: "Steps",
    blurb: "Granite treads and the 3.6m composite step board.",
    mode: "steps",
    note: "Treads and risers are sold whole. A wider step needs another whole piece. Nothing is cut to a shorter price. Loose step corners stay in the product list.",
    products: [
      {
        id: "step-bull",
        name: "Granite bullnose step 1000 × 400mm",
        lengthM: 1,
        depthM: 0.4,
        swatch: "#C8C6C2",
        note: "Thickness prices are £24, £36, and £48 inc VAT.",
        variants: [
          { id: "step-bull-30", name: "30mm", price: 20 },
          { id: "step-bull-40", name: "40mm", price: 30 },
          { id: "step-bull-50", name: "50mm", price: 40 },
        ],
      },
      { id: "step-silver", name: "G603 silver step 1000 × 400 × 30mm", lengthM: 1, depthM: 0.4, price: 20, swatch: "#C5C7C4", note: "£24 inc VAT each." },
      { id: "step-solid", name: "Solid granite step 900 × 300 × 255mm", lengthM: 0.9, depthM: 0.3, price: 60, swatch: "#A9A59C", note: "£72 inc VAT each." },
      { id: "step-riser", name: "G603 riser 1000 × 150 × 30mm", lengthM: 1, depthM: 0.15, price: 10, swatch: "#C5C7C4", note: "£12 inc VAT each." },
      { id: "step-board", name: "Composite step board 3600 × 310 × 55mm", lengthM: 3.6, depthM: 0.31, price: 58.33, swatch: "#8B7355", note: "£70 inc VAT each." },
    ],
  },
  {
    id: "purlin",
    name: "Purlins",
    blurb: "Cut to the length you enter, £6 inc VAT per metre.",
    mode: "linear",
    note: "The website price is £5 plus VAT per metre, cut to length.",
    products: [
      { id: "purlin-c", name: "Multibeam C purlin 210 × 65 × 1.5mm", priceUnit: "m", price: 5, swatch: "#8D97A3", note: "£6 inc VAT per metre." },
    ],
  },
  {
    id: "acrylic",
    name: "Acrylic sheets",
    blurb: "2.4 × 1.2m sheets in 4mm, 6mm, and 10mm.",
    mode: "area",
    wasteDefault: 0,
    note: "Sheets are sold whole at 2.4m × 1.2m. This counts how many cover the area. A smaller opening does not get a cut-down price. The 2.4m side runs along the length you enter.",
    products: [
      {
        id: "acrylic-sheet",
        name: "Clear acrylic sheet 2.4 × 1.2m",
        lengthM: 2.4,
        coverM: 1.2,
        swatch: "#D7EEF8",
        note: "£80, £120, and £200 inc VAT.",
        variants: [
          { id: "acrylic-4", name: "4mm", price: 66.67 },
          { id: "acrylic-6", name: "6mm", price: 100 },
          { id: "acrylic-10", name: "10mm", price: 166.67 },
        ],
      },
    ],
  },
];
