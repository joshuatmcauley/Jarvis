(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  const header = document.querySelector(".header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    const bar = document.querySelector(".scroll-progress");
    if (bar && !CSS.supports("animation-timeline", "scroll()")) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = "scaleX(" + p + ")";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  const burger = document.querySelector("[data-burger]");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-parent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.matchMedia("(min-width: 981px)").matches) return;
      const item = btn.closest(".nav-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const root = document.body.dataset.root || "";
  const KEY = "bcmckeown-cart";
  const money = (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(n));
  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  };
  const writeCart = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    renderCart();
  };

  const renderCart = () => {
    const items = readCart();
    const count = items.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.dataset.count = String(count);
    });
    const lines = document.querySelector("[data-cart-lines]");
    const totalEl = document.querySelector("[data-cart-total]");
    const page = document.querySelector("[data-cart-page]");
    const total = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);
    if (totalEl) totalEl.textContent = money(total);
    const empty = '<p class="empty">Your cart is empty.</p>';
    const markup = items.length
      ? items
          .map(
            (item) => `<article class="cart-line">
            <img src="${item.image}" alt="">
            <div>
              <p><a href="${root}${item.url}">${item.title}</a></p>
              <p class="muted">${item.variant && item.variant !== "Default Title" ? item.variant + " · " : ""}${money(item.price)}</p>
              <label>Qty <input class="qty" data-qty="${item.id}" type="number" min="1" value="${item.qty}"></label>
            </div>
            <button class="icon-btn" data-remove="${item.id}" aria-label="Remove">×</button>
          </article>`
          )
          .join("")
      : empty;
    if (lines) lines.innerHTML = markup;
    if (page) {
      page.innerHTML = items.length
        ? markup + `<p class="price">Total ${money(total)}</p><button class="btn btn-green" data-checkout type="button">Checkout</button><p class="hint">Checkout opens your basket on bcmckeown.net.</p>`
        : empty;
    }
  };

  const openCart = () => document.body.classList.add("cart-open");
  const closeCart = () => document.body.classList.remove("cart-open");
  document.querySelectorAll("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
  document.querySelectorAll("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));

  document.body.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove]");
    const checkout = event.target.closest("[data-checkout]");
    if (remove) {
      writeCart(readCart().filter((i) => String(i.id) !== remove.dataset.remove));
    }
    if (checkout) {
      const items = readCart();
      if (!items.length) return;
      const path = items.map((i) => i.id + ":" + i.qty).join(",");
      window.location.href = "https://bcmckeown.net/cart/" + path;
    }
  });
  document.body.addEventListener("change", (event) => {
    const input = event.target.closest("[data-qty]");
    if (!input) return;
    const qty = Math.max(1, parseInt(input.value, 10) || 1);
    writeCart(
      readCart().map((i) => (String(i.id) === input.dataset.qty ? { ...i, qty } : i))
    );
  });

  const productData = document.getElementById("product-data");
  if (productData) {
    const data = JSON.parse(productData.textContent);
    const form = document.querySelector("[data-buy]");
    const priceEl = document.querySelector("[data-price]");
    const selects = [...form.querySelectorAll("select[data-option]")];
    const button = form.querySelector("[data-add]");
    const current = () => {
      const chosen = selects.map((s) => s.value);
      return (
        data.variants.find((v) => chosen.every((value, i) => v.options[i] === value)) ||
        data.variants[0]
      );
    };
    const paint = () => {
      const v = current();
      priceEl.innerHTML = v.compare
        ? `<span class="now-sale">${money(v.price)}</span> <s class="was">${money(v.compare)}</s>`
        : money(v.price);
      button.disabled = !v.available;
      button.textContent = v.available ? "Add to cart" : "Sold out";
      button.dataset.variant = String(v.id);
    };
    selects.forEach((s) => s.addEventListener("change", paint));
    paint();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const v = current();
      if (!v.available) return;
      const qty = Math.max(1, parseInt(form.querySelector("[data-add-qty]").value, 10) || 1);
      const items = readCart();
      const found = items.find((i) => String(i.id) === String(v.id));
      if (found) found.qty += qty;
      else {
        items.push({
          id: v.id,
          qty,
          title: data.title,
          price: v.price,
          variant: v.title,
          image: data.image,
          url: data.url,
        });
      }
      writeCart(items);
      openCart();
    });
    document.querySelectorAll("[data-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const main = document.querySelector("[data-main-image]");
        main.src = thumb.dataset.full;
        main.alt = thumb.dataset.alt || "";
        document.querySelectorAll("[data-thumb]").forEach((t) => t.removeAttribute("aria-current"));
        thumb.setAttribute("aria-current", "true");
      });
    });
  }

  const sort = document.querySelector("[data-sort]");
  const grid = document.querySelector("[data-grid]");
  if (sort && grid) {
    const cards = [...grid.children];
    sort.addEventListener("change", () => {
      const mode = sort.value;
      const next = [...cards];
      if (mode === "price-asc" || mode === "price-desc") {
        next.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
        if (mode === "price-desc") next.reverse();
      } else if (mode === "name") {
        next.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
      }
      next.forEach((card) => grid.appendChild(card));
    });
  }
  const filter = document.querySelector("[data-filter]");
  if (filter && grid) {
    filter.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      [...grid.children].forEach((card) => {
        card.hidden = q && !card.dataset.title.toLowerCase().includes(q);
      });
    });
  }

  const searchToggle = document.querySelectorAll("[data-open-search]");
  const searchPanel = document.querySelector(".search-panel");
  const searchInput = document.querySelector("[data-search]");
  const searchResults = document.querySelector("[data-search-results]");
  let catalog = null;
  const loadCatalog = async () => {
    if (catalog) return catalog;
    const res = await fetch(root + "catalog.json");
    catalog = await res.json();
    return catalog;
  };
  const openSearch = async () => {
    document.body.classList.add("search-open");
    await loadCatalog();
    searchInput.focus();
    runSearch();
  };
  const runSearch = () => {
    if (!catalog) return;
    const q = searchInput.value.trim().toLowerCase();
    const hits = catalog
      .filter((p) => !q || p.title.toLowerCase().includes(q))
      .slice(0, 8);
    searchResults.innerHTML = hits
      .map(
        (p) => `<a href="${root}products/${p.handle}/">
          <img src="${p.image}" alt="">
          <span>${p.title}</span>
          <span>${money(p.price)}</span>
        </a>`
      )
      .join("");
  };
  searchToggle.forEach((b) => b.addEventListener("click", openSearch));
  document.querySelectorAll("[data-close-search]").forEach((b) =>
    b.addEventListener("click", () => document.body.classList.remove("search-open"))
  );
  if (searchInput) searchInput.addEventListener("input", runSearch);

  document.querySelectorAll("[data-news]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = new FormData(form).get("email");
      window.location.href =
        "mailto:michael@bcmckeownltd.com?subject=" +
        encodeURIComponent("Newsletter") +
        "&body=" +
        encodeURIComponent(String(email || ""));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.body.classList.remove("cart-open", "search-open", "nav-open");
  });

  renderCart();
})();
