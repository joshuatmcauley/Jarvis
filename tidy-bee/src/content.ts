export const WHATSAPP_NUMBER = '447874463679'
export const WHATSAPP_DISPLAY = '07874 463679'

export const packages = [
  {
    id: 'standard',
    name: 'Standard Clean',
    from: 45,
    featured: false,
    blurb: 'General cleaning to keep your home fresh and tidy.',
    includes: [
      'Dusting all surfaces',
      'Vacuuming & mopping',
      'Kitchen clean (surfaces, sink, hob)',
      'Bathroom clean',
      'Empty bins',
      'Making beds',
    ],
  },
  {
    id: 'deep',
    name: 'Deep Clean',
    from: 90,
    featured: true,
    blurb: 'A thorough clean for a spotless home — top to bottom, inside and out.',
    includes: [
      'Everything in Standard Clean',
      'Inside oven (removable parts)',
      'Inside fridge',
      'Skirting boards & doors',
      'Light fittings & switches',
      'Detailed bathroom & kitchen',
    ],
  },
  {
    id: 'move',
    name: 'Move In / Out Clean',
    from: 120,
    featured: false,
    blurb: 'Perfect for moving home. Leave it spotless and ready for new beginnings.',
    includes: [
      'Deep clean of all areas',
      'Inside cupboards & drawers',
      'Oven & fridge cleaned',
      'Windows (inside)',
      'Bathrooms descaled',
    ],
  },
] as const

export const extras = [
  { id: 'oven', name: 'Oven clean', price: 20, unit: 'each' },
  { id: 'fridge', name: 'Fridge clean', price: 10, unit: 'each' },
  { id: 'microwave', name: 'Microwave clean', price: 10, unit: 'each' },
  { id: 'windows', name: 'Window cleaning', price: 5, unit: 'each' },
  { id: 'ironing', name: 'Ironing', price: 15, unit: 'hour' },
  { id: 'carpet', name: 'Carpet & upholstery refresh', price: 25, unit: 'from' },
  { id: 'declutter', name: 'Decluttering & organising', price: 25, unit: 'from' },
  { id: 'kitchen', name: 'Kitchen deep clean', price: 25, unit: 'from' },
  { id: 'bathroom', name: 'Bathroom deep clean', price: 25, unit: 'from' },
  { id: 'patio', name: 'Balcony / patio clean', price: 20, unit: 'from' },
] as const

export const laundry = [
  { name: 'Wash, dry & fold', detail: '£15 per load' },
  { name: 'Ironing', detail: '£15 per hour' },
  { name: 'Bed linen change', detail: '£10' },
  { name: 'Collection & delivery', detail: 'From £5 · free over £25' },
] as const

export const areas = [
  'Downpatrick',
  'Saintfield',
  'Crossgar',
  'Killyleagh',
  'Clough',
  'Castlewellan',
] as const

export const servicesList = [
  'Regular domestic cleans',
  'One-off cleans — no contracts',
  'Deep cleans',
  'Kitchen & bathroom cleaning',
  'Dusting & polishing',
  'Vacuuming & mopping',
  'General household cleaning',
  'Move-in / move-out cleans',
  'End of tenancy clean',
] as const

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
