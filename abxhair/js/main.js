(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const year = document.querySelector("#year");
  const form = document.querySelector("#book-form");
  const status = document.querySelector("#form-status");
  const serviceSelect = document.querySelector("#service");
  const dialog = document.querySelector("#lightbox");
  const figures = Array.from(document.querySelectorAll("[data-gallery] figure"));

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = new Map(
    Array.from(nav.querySelectorAll("a")).map((link) => [link.getAttribute("href").slice(1), link])
  );

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.removeAttribute("aria-current"));
          const current = navLinks.get(entry.target.id);
          if (current) current.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  document.querySelectorAll("[data-book]").forEach((link) => {
    link.addEventListener("click", () => {
      const value = link.getAttribute("data-book");
      const match = Array.from(serviceSelect.options).find((option) => option.value === value);
      if (match) serviceSelect.value = value;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const lines = [
      "Hi Aleigha, I'd like to book with ABX Hair.",
      "Name: " + String(data.get("name") || "").trim(),
      "Service: " + String(data.get("service") || "").trim()
    ];
    const phone = String(data.get("phone") || "").trim();
    const day = String(data.get("day") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    if (phone) lines.push("My number: " + phone);
    if (day) lines.push("Preferred day: " + day);
    if (notes) lines.push("Notes: " + notes);

    const url = "https://wa.me/447359811298?text=" + encodeURIComponent(lines.join("\n"));
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.href = url;
      return;
    }
    status.textContent = "WhatsApp is open with your message ready. Press send there to reach Aleigha.";
  });

  if (!dialog || figures.length === 0) return;

  const lightboxImage = dialog.querySelector("img");
  const lightboxCaption = dialog.querySelector("figcaption");
  let index = 0;

  const show = (next) => {
    index = (next + figures.length) % figures.length;
    const source = figures[index].querySelector("img");
    const caption = figures[index].querySelector("figcaption");
    lightboxImage.src = source.currentSrc || source.src;
    lightboxImage.alt = source.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    if (!dialog.open) dialog.showModal();
  };

  figures.forEach((figure, figureIndex) => {
    figure.querySelector(".shot").addEventListener("click", () => show(figureIndex));
  });

  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
  dialog.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
  });
})();
