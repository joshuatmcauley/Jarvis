#!/usr/bin/env python3
"""Generate the static B&C McKeown site from the captured Shopify catalogue."""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "source"

META = (
    "B&C McKeown is a supplier specializing in composite decking, wall panels, "
    "and roof cladding, located in Downpatrick, County Down, Northern Ireland. "
    "They provide high-quality, durable, and low-maintenance solutions for outdoor "
    "and architectural projects. Composite materials, known for weather resistance."
)
HOME_TITLE = "B&C McKeown is a composite supplier based in Downpatrick, County Down."

NAV = [
    ("Home", "index.html", None),
    (
        "Composites",
        None,
        [
            ("Composite Decking", "collections/composite-decking/"),
            ("Composite Gate Kits", "products/diy-composite-gate-kit-aluminum-extrusion-frame/"),
            ("Composite Gardenroom/Sheds", "collections/composite-sheds-and-garden-rooms/"),
            ("Composite Fencing", "collections/composite-fencing/"),
            ("Composite Wall Cladding", "collections/composite-wall-cladding/"),
        ],
    ),
    (
        "Granite / Landscaping",
        "collections/granite/",
        [
            ("Granite Paving 900x600mm", "products/silver-grey-natural-granite-paving-900x600x30mm/"),
            ("Granite Paving 600x300mm", "products/granite-paving-g603-silver-600x300x30mm/"),
            ("Granite Gate Posts", "products/granite-gate-posts-natural-stone-with-pointed-top/"),
            ("Granite Kerbs", "collections/granite-kerbs/"),
            ("Granite Steps", "collections/granite-steps/"),
            ("Dark Grey Porcelain Tiles", "products/grey-outdoor-porcelain-paving-20mm-400x800mm/"),
            ("Light Grey Porcelain Tiles", "products/light-grey-outdoor-porcelain-paving-20mm-400x800mm/"),
        ],
    ),
    (
        "Roofing",
        None,
        [
            ("Clear Roofing", "collections/clear-roofing-sheets/"),
            ("Flat Pespex", "products/clear-transparent-acrylic-sheet/"),
            ("Metal Roofing", "collections/roof-cladding/"),
            ("Purlins", "products/multibeam-c-purlin-roof-beam-210x65mm/"),
            ("Sandwich Panel 50mm", "products/50mm-sandwich-panel-roofing-sheets-various-lengths-4-5-6-and-7-metres/"),
        ],
    ),
    ("V Mesh Fencing / Gates", "collections/security-fencing-v-mesh-kits/", None),
    (
        "More",
        None,
        [
            ("Contact", "pages/contact/"),
            ("About Us", "pages/ecoluxclad-about-us/"),
        ],
    ),
]

HOME_CATS = [
    ("Composite Decking", "collections/composite-decking/", "https://bcmckeown.net/cdn/shop/files/Composite_Decking_Sale.png?v=1771507015", "Outdoor seating area with a fire pit on a wooden deck"),
    ("Composite Wall Panel", "collections/composite-wall-cladding/", "https://bcmckeown.net/cdn/shop/files/Slatted_Wall_Panel.png?v=1771507161", "Modern black house with large glass door and windows"),
    ("Composite Fencing", "collections/composite-fencing/", "https://bcmckeown.net/cdn/shop/files/Composite_fencing_Grey.png?v=1771507655", "Composite Plastic Fencing Main Image"),
    ("Composite Garden Room", "collections/composite-sheds-and-garden-rooms/", "https://bcmckeown.net/cdn/shop/files/Composite_Garden_Room.jpg?v=1771508181", "Composite Garden Room Front View"),
    ("Roof Cladding", "collections/metal-roof-cladding-collection/", "https://bcmckeown.net/cdn/shop/files/Metal_Roofing.png?v=1771507584", "Black corrugated metal sheet on a white background"),
    ("Composite Sheds", "collections/composite-sheds-and-garden-rooms/", "https://bcmckeown.net/cdn/shop/files/Composite_Garden_Shed_Sale.png?v=1771508044", "Gray garden shed with plants and a clear sky"),
    ("Landscaping/Paving", "collections/granite/", "https://bcmckeown.net/cdn/shop/files/Granite_Paving_Silver.png?v=1771508480", "Outdoor patio with stone bench, fire pit, and dining area"),
    ("Clear Roofing", "collections/clear-roofing-collection/", "https://bcmckeown.net/cdn/shop/files/Clear_Roof_Patio.png?v=1771508640", "People sitting around a wooden table with food, viewed through a clear roof"),
    ("V Mesh Fencing & Gates", "collections/security-fencing-v-mesh-kits/", "https://bcmckeown.net/cdn/shop/files/V_Mesh_Fencing.jpg?v=1771509848", "V Mesh Fencing"),
]

PROMISES = [
    ("Fast Shipping", "We ship your order within 24–48 hours so you get it fast and hassle-free!", "https://bcmckeown.net/cdn/shop/files/delivery_5.png?v=1750877136"),
    ("Money Guarantee", "Not satisfied? Get a full refund—no questions asked! Shop with confidence.", "https://bcmckeown.net/cdn/shop/files/secure.png?v=1750877163"),
    ("24/7 Support", "We’re here for you anytime, day or night—just a message away!", "https://bcmckeown.net/cdn/shop/files/support_1.png?v=1750877235"),
]


def esc(value):
    return html.escape(str(value if value is not None else ""), quote=True)


def clean_html(value):
    text = value or ""
    text = re.sub(r"<script[\s\S]*?</script>", "", text, flags=re.I)
    text = re.sub(r"\son\w+\s*=\s*(['\"]).*?\1", "", text, flags=re.I)
    return text


def sized(url, width):
    if not url:
        return ""
    if url.startswith("//"):
        url = "https:" + url
    if "width=" in url:
        return re.sub(r"width=\d+", f"width={width}", url)
    join = "&" if "?" in url else "?"
    return f"{url}{join}width={width}"


def money(value):
    amount = float(value)
    return f"£{amount:,.2f}"


def load():
    products = json.loads((SRC / "products.json").read_text())["products"]
    collections = json.loads((SRC / "collections.json").read_text())["collections"]
    membership = json.loads((SRC / "collection_products.json").read_text())
    copy = json.loads((SRC / "home_copy.json").read_text())
    about = json.loads((SRC / "about.json").read_text())["page"]
    contact = json.loads((SRC / "contact.json").read_text())["page"]
    policies = []
    for path in sorted(SRC.glob("policy-*.json")):
        policies.append(json.loads(path.read_text())["policy"])
    by_handle = {p["handle"]: p for p in products}
    return products, by_handle, collections, membership, copy, about, contact, policies


def prefix(depth):
    return "../" * depth


def write(rel, content):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    return path


def icon(name):
    icons = {
        "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
        "bag": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
        "menu": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
        "close": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    }
    return icons[name]


def nav_html(root):
    parts = []
    for label, href, children in NAV:
        if children:
            links = "".join(
                f'<a href="{root}{href_}">{esc(text)}</a>' for text, href_ in children
            )
            parts.append(
                f'<div class="nav-item"><button class="nav-parent" type="button" data-parent aria-expanded="false">{esc(label)}</button><div class="nav-sub">{links}</div></div>'
            )
        else:
            url = href if href.startswith("http") else f"{root}{href}"
            parts.append(f'<div class="nav-item"><a class="nav-link" href="{url}">{esc(label)}</a></div>')
    return "".join(parts)


def chrome(root):
    return f"""
<a class="skip" href="#main">Skip to content</a>
<div class="scroll-progress" aria-hidden="true"></div>
<div class="announce">
  <div class="announce-track">
    <a href="tel:02844615148">Call Us On 02844615148</a><span class="star">★</span><span>Delivery Available</span><span class="star">★</span><span>New arrivals every week</span><span class="star">★</span>
    <a href="tel:02844615148">Call Us On 02844615148</a><span class="star">★</span><span>Delivery Available</span><span class="star">★</span><span>New arrivals every week</span><span class="star">★</span>
  </div>
</div>
<header class="header">
  <a class="logo" href="{root}index.html"><img src="{root}assets/logo.png" alt="B&amp;C McKeown LTD"></a>
  <button class="icon-btn burger" type="button" data-burger aria-expanded="false" aria-label="Menu">{icon("menu")}</button>
  <nav class="nav" aria-label="Primary">{nav_html(root)}<div class="nav-item mobile-only"><a class="nav-link" href="https://bcmckeown.net/account">Account</a></div><div class="nav-item mobile-only"><a class="nav-link" href="https://bcmckeown.net/pages/wishlist">Wishlist</a></div></nav>
  <div class="tools">
    <a class="nav-link hide-sm" href="https://bcmckeown.net/account">Account</a>
    <a class="nav-link hide-sm" href="https://bcmckeown.net/pages/wishlist">Wishlist</a>
    <button class="icon-btn" type="button" data-open-search aria-label="Search">{icon("search")}</button>
    <button class="icon-btn" type="button" data-open-cart aria-label="Cart">{icon("bag")}<span class="count" data-cart-count data-count="0">0</span></button>
  </div>
</header>
"""


def footer(root):
    return f"""
<footer class="footer">
  <div class="footer-grid">
    <div>
      <h2>Let’s get in touch Call 02844615148</h2>
      <p class="fine">Showroom: 12 Cloonagh Road, Downpatrick, Co Down, Bt30 6LJ<br>
      Company: 38 Old Course Road, Downpatrick BT30 8BD<br>
      <a href="mailto:michael@bcmckeownltd.com">michael@bcmckeownltd.com</a><br>
      VAT Xi 454604453 · Trade NI070849</p>
      <p class="pay">Payment options: PayPal</p>
    </div>
    <div>
      <h3>Quick link</h3>
      <ul>
        <li><a href="{root}index.html">Home</a></li>
        <li><a href="{root}collections/composite-collection/">Composites</a></li>
        <li><a href="{root}collections/granite/">Granite / Landscaping</a></li>
        <li><a href="{root}collections/roof-cladding/">Roofing</a></li>
        <li><a href="{root}collections/security-fencing-v-mesh-kits/">V Mesh Fencing / Gates</a></li>
        <li><a href="{root}pages/contact/">More</a></li>
      </ul>
    </div>
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="{root}policies/terms-of-service.html">Terms of Service</a></li>
        <li><a href="{root}policies/privacy-policy.html">Privacy Policy</a></li>
        <li><a href="{root}policies/refund-policy.html">Refund Policy</a></li>
        <li><a href="{root}policies/shipping-policy.html">Shipping Policy</a></li>
        <li><a href="{root}policies/contact-information.html">Contact information</a></li>
        <li><a href="{root}pages/ecoluxclad-about-us/">About Us</a></li>
      </ul>
    </div>
    <div class="footer-news">
      <h3>Sign up for our newsletter</h3>
      <form data-news>
        <label class="sr" for="footer-email">Email</label>
        <input id="footer-email" name="email" type="email" required placeholder="Email">
        <button class="btn" type="submit">Subscribe now</button>
      </form>
      <p class="hint">Opens an email to michael@bcmckeownltd.com.</p>
    </div>
  </div>
</footer>
<div class="mobile-bar">
  <a href="tel:02844615148">Call 02844615148</a>
  <button type="button" data-open-cart>Cart <span data-cart-count data-count="0">0</span></button>
</div>
<div class="drawer-back" data-close-cart></div>
<aside class="drawer" aria-label="Cart">
  <header>
    <h2>Cart</h2>
    <button class="icon-btn" type="button" data-close-cart aria-label="Close cart">{icon("close")}</button>
  </header>
  <div class="cart-lines" data-cart-lines></div>
  <div class="cart-foot">
    <p>Total <strong data-cart-total>£0.00</strong></p>
    <button class="btn btn-green" type="button" data-checkout>Checkout</button>
    <p class="hint">Checkout opens your basket on bcmckeown.net.</p>
  </div>
</aside>
<div class="search-back" data-close-search></div>
<div class="search-panel">
  <header>
    <h2>Search</h2>
    <button class="icon-btn" type="button" data-close-search aria-label="Close search">{icon("close")}</button>
  </header>
  <label class="sr" for="site-search">Search products</label>
  <input id="site-search" data-search type="search" placeholder="Search products">
  <div class="search-results" data-search-results></div>
</div>
"""


def layout(title, description, depth, body, active_root_path=""):
    root = prefix(depth)
    return f"""<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="theme-color" content="#275202">
  <link rel="icon" href="{root}assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Teko:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{root}css/styles.css">
</head>
<body data-root="{root}">
{chrome(root)}
<main id="main">
{body}
</main>
{footer(root)}
<script src="{root}js/main.js" defer></script>
</body>
</html>
"""


def price_html(product):
    variant = next((v for v in product["variants"] if v.get("available")), product["variants"][0])
    price = money(variant["price"])
    compare = variant.get("compare_at_price")
    if compare and float(compare) > float(variant["price"]):
        return f'<span class="now-sale">{price}</span> <s class="was">{money(compare)}</s>'
    if not any(v.get("available") for v in product["variants"]):
        return f'{price} <span class="badge">Sold out</span>'
    return price


def card(product, root):
    image = product["images"][0]["src"] if product["images"] else ""
    alt = product["images"][0].get("alt") or product["title"] if product["images"] else product["title"]
    low = min(float(v["price"]) for v in product["variants"])
    return f"""<a class="card" href="{root}products/{product['handle']}/" data-title="{esc(product['title'])}" data-price="{low}">
      <div class="card-media"><img src="{esc(sized(image, 800))}" alt="{esc(alt)}" loading="lazy"></div>
      <h3>{esc(product['title'])}</h3>
      <p class="price">{price_html(product)}</p>
    </a>"""


def variant_payload(product):
    variants = []
    for variant in product["variants"]:
        options = [variant.get("option1"), variant.get("option2"), variant.get("option3")]
        options = [o for o in options if o]
        variants.append(
            {
                "id": variant["id"],
                "title": variant["title"],
                "price": variant["price"],
                "compare": variant.get("compare_at_price") or "",
                "available": bool(variant.get("available")),
                "options": options or ["Default Title"],
            }
        )
    return variants


def real_options(product):
    options = []
    for option in product["options"]:
        if option["name"] == "Title" and option["values"] == ["Default Title"]:
            continue
        options.append(option)
    return options


def build():
    products, by_handle, collections, membership, copy, about, contact, policies = load()
    catalog = []
    for product in products:
        image = sized(product["images"][0]["src"], 200) if product["images"] else ""
        catalog.append(
            {
                "handle": product["handle"],
                "title": product["title"],
                "price": product["variants"][0]["price"],
                "image": image,
            }
        )
    (ROOT / "catalog.json").write_text(json.dumps(catalog))

    quotes = []
    for item in copy["testimonials"]:
        quotes.append(
            f"""<article class="quote reveal">
              <h3>{esc(item['title'])}</h3>
              <p>{esc(item['quote'])}</p>
              <footer>{esc(item['by'])}</footer>
            </article>"""
        )
    cats = []
    for i, (label, href, image, alt) in enumerate(HOME_CATS):
        cats.append(
            f'<a class="cat" href="{href}"><img src="{esc(sized(image, 1400))}" alt="{esc(alt)}" {"loading=\"eager\"" if i == 0 else "loading=\"lazy\""}><span>{esc(label)}</span></a>'
        )
    promises = []
    for title, text, image in PROMISES:
        promises.append(
            f'<article class="promise reveal"><img src="{esc(sized(image, 256))}" alt=""><h3>{esc(title)}</h3><p>{esc(text)}</p></article>'
        )
    home = f"""
<section class="hero">
  <div class="hero-media">
    <img src="{esc(sized(HOME_CATS[3][2], 2000))}" alt="{esc(HOME_CATS[3][3])}">
  </div>
  <div class="hero-copy">
    <p class="kicker">B&amp;C McKeown LTD</p>
    <h1>{esc(HOME_TITLE)}</h1>
    <p class="lede">With over 30 years of industry experience, we proudly serve homeowners, contractors, developers, and commercial enterprises across the region.</p>
    <div class="hero-actions">
      <a class="btn btn-green" href="collections/composite-decking/">Composite Decking</a>
      <a class="btn btn-ghost" href="pages/contact/">Contact</a>
    </div>
  </div>
</section>
<section class="cats" aria-label="Collections">
  {''.join(cats)}
</section>
<section class="section">
  <h2>What People Are Saying</h2>
  <div class="quotes">{''.join(quotes)}</div>
</section>
<section class="section" style="padding-top:0">
  <div class="promises">{''.join(promises)}</div>
</section>
<section class="section" style="padding-top:0">
  <div class="about-grid">
    <img src="{esc(sized(HOME_CATS[6][2], 1400))}" alt="{esc(HOME_CATS[6][3])}" loading="lazy">
    <div class="reveal">
      <h2>About Us</h2>
      <p>{esc(copy['about'])}</p>
      <div class="about-actions"><a class="btn btn-green" href="pages/ecoluxclad-about-us/">Learn more</a></div>
    </div>
  </div>
</section>
<section class="news">
  <h2>Stay up to date with all news and exclusive offers</h2>
  <div>
    <form data-news>
      <label class="sr" for="home-email">Email</label>
      <input id="home-email" name="email" type="email" required placeholder="Email">
      <button class="btn" type="submit">Subscribe</button>
    </form>
    <p class="hint">Opens an email to michael@bcmckeownltd.com.</p>
  </div>
</section>
"""
    write("index.html", layout(HOME_TITLE, META, 0, home))

    about_body = clean_html(about.get("body_html") or "")
    write(
        "pages/ecoluxclad-about-us/index.html",
        layout(
            "B&C McKeown About Us",
            META,
            2,
            f"""<header class="page-hero"><p class="crumbs"><a href="../../index.html">Home</a> / About Us</p><h1>About Us</h1></header>
            <section class="section prose" style="padding-top:0"><div class="rte">{about_body}</div></section>""",
        ),
    )

    contact_body = clean_html(contact.get("body_html") or "")
    policy_contact = next(p for p in policies if p["handle"] == "contact-information")
    write(
        "pages/contact/index.html",
        layout(
            contact["title"],
            "Contact B&C McKeown LTD in Downpatrick.",
            2,
            f"""<header class="page-hero"><p class="crumbs"><a href="../../index.html">Home</a> / Contact</p><h1>{esc(contact['title'])}</h1></header>
            <div class="contact-grid">
              <div class="contact-card rte">{clean_html(policy_contact.get('body') or '')}
                <p><a class="btn btn-green" href="tel:02844615148">Call 02844615148</a></p>
              </div>
              <div class="map-wrap">{contact_body}</div>
            </div>""",
        ),
    )

    write(
        "cart/index.html",
        layout(
            "Cart — B&C McKeown LTD",
            "Your B&C McKeown cart.",
            1,
            """<header class="page-hero"><h1>Cart</h1></header>
            <section class="section" style="padding-top:0" data-cart-page></section>""",
        ),
    )

    write(
        "pages/wishlist/index.html",
        layout(
            "Wishlist — B&C McKeown LTD",
            "Wishlist on bcmckeown.net.",
            2,
            """<header class="page-hero"><p class="crumbs"><a href="../../index.html">Home</a> / Wishlist</p><h1>Wishlist</h1></header>
            <section class="section prose" style="padding-top:0">
              <p><a class="btn btn-green" href="https://bcmckeown.net/pages/wishlist">Wishlist</a>
              <a class="btn btn-line" href="https://bcmckeown.net/account">Account</a></p>
            </section>""",
        ),
    )

    for policy in policies:
        handle = policy["handle"]
        write(
            f"policies/{handle}.html",
            layout(
                f"{policy['title']} — B&C McKeown LTD",
                policy["title"],
                1,
                f"""<header class="page-hero"><p class="crumbs"><a href="../index.html">Home</a> / {esc(policy['title'])}</p><h1>{esc(policy['title'])}</h1></header>
                <article class="policy rte">{clean_html(policy.get('body') or '')}</article>""",
            ),
        )

    col_by_handle = {c["handle"]: c for c in collections}

    def collection_page(handle, title, image, handles, depth=2):
        items = [by_handle[h] for h in handles if h in by_handle]
        grid = "".join(card(p, prefix(depth)) for p in items) or '<p class="empty">This collection is empty.</p>'
        hero_img = ""
        if image:
            hero_img = f'<img src="{esc(sized(image, 1600))}" alt="" style="width:100%;max-height:420px;object-fit:cover">'
        body = f"""<header class="page-hero"><p class="crumbs"><a href="{prefix(depth)}index.html">Home</a> / {esc(title)}</p><h1>{esc(title)}</h1></header>
        {hero_img}
        <div class="toolbar">
          <p class="muted">{len(items)} products</p>
          <label>Sort
            <select data-sort>
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
          {"<label class='sr' for='filter'>Filter</label><input id='filter' data-filter type='search' placeholder='Filter'>" if handle == "all" else ""}
        </div>
        <div class="product-grid" data-grid>{grid}</div>"""
        write(f"collections/{handle}/index.html", layout(f"{title} — B&C McKeown LTD", title, depth, body))

    for collection in collections:
        image = None
        if isinstance(collection.get("image"), dict):
            image = collection["image"].get("src")
        handles = membership.get(collection["handle"], [])
        if not image and handles and handles[0] in by_handle and by_handle[handles[0]]["images"]:
            image = by_handle[handles[0]]["images"][0]["src"]
        collection_page(collection["handle"], collection["title"], image, handles)

    collection_page("all", "All products", None, [p["handle"] for p in products])

    parent = {}
    preferred = [
        "composite-decking",
        "composite-wall-cladding",
        "composite-fencing",
        "composite-sheds-and-garden-rooms",
        "granite",
        "roof-cladding",
        "clear-roofing-sheets",
        "security-fencing-v-mesh-kits",
        "metal-roof-cladding-collection",
        "composite-collection",
    ]
    for handle in preferred:
        for product_handle in membership.get(handle, []):
            parent.setdefault(product_handle, handle)
    for handle, product_handles in membership.items():
        for product_handle in product_handles:
            parent.setdefault(product_handle, handle)

    for product in products:
        image = product["images"][0]["src"] if product["images"] else ""
        thumbs = []
        for i, img in enumerate(product["images"]):
            thumbs.append(
                f'<button type="button" data-thumb data-full="{esc(sized(img["src"], 1400))}" data-alt="{esc(img.get("alt") or product["title"])}" {"aria-current=\"true\"" if i == 0 else ""}><img src="{esc(sized(img["src"], 200))}" alt=""></button>'
            )
        options_html = []
        for index, option in enumerate(real_options(product), start=1):
            choices = "".join(f'<option value="{esc(v)}">{esc(v)}</option>' for v in option["values"])
            options_html.append(
                f'<label class="field">{esc(option["name"])}<select data-option data-index="{index}">{choices}</select></label>'
            )
        data = {
            "title": product["title"],
            "url": f"products/{product['handle']}/",
            "image": sized(image, 400),
            "variants": variant_payload(product),
        }
        related_handle = parent.get(product["handle"])
        related = ""
        if related_handle:
            others = [by_handle[h] for h in membership.get(related_handle, []) if h != product["handle"] and h in by_handle][:4]
            if others:
                related = f'<section class="section related"><h2>{esc(col_by_handle.get(related_handle, {}).get("title", "Related"))}</h2><div class="product-grid">{"".join(card(p, "../../") for p in others)}</div></section>'
        gallery = ""
        if image:
            gallery = f"""<div class="gallery">
              <div class="gallery-main"><img data-main-image src="{esc(sized(image, 1400))}" alt="{esc(product['images'][0].get('alt') or product['title'])}"></div>
              <div class="thumbs">{''.join(thumbs)}</div>
            </div>"""
        body = f"""
<div class="product">
  {gallery}
  <div class="buy">
    <p class="crumbs"><a href="../../index.html">Home</a>{f' / <a href="../../collections/{related_handle}/">{esc(col_by_handle.get(related_handle, {}).get("title", ""))}</a>' if related_handle and related_handle in col_by_handle else ''}</p>
    <h1>{esc(product['title'])}</h1>
    <p class="price" data-price></p>
    <form data-buy>
      <div class="options">{''.join(options_html)}</div>
      <div class="buy-row">
        <label class="sr" for="qty-{product['handle']}">Quantity</label>
        <input class="qty" id="qty-{product['handle']}" data-add-qty type="number" min="1" value="1">
        <button class="btn btn-green" data-add type="submit">Add to cart</button>
      </div>
    </form>
    <p class="hint">Checkout opens your basket on bcmckeown.net.</p>
    <div class="rte">{clean_html(product.get('body_html') or '')}</div>
  </div>
</div>
<script type="application/json" id="product-data">{json.dumps(data).replace("<", "\\u003c")}</script>
{related}
"""
        desc = re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", product.get("body_html") or ""))[:180]
        write(
            f"products/{product['handle']}/index.html",
            layout(f"{product['title']} — B&C McKeown LTD", desc or product["title"], 2, body),
        )

    print(f"Built {len(products)} products and {len(collections)} collections")


if __name__ == "__main__":
    build()
