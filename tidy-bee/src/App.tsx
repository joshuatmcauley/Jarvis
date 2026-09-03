import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { Bee } from './Bee'
import { QuoteBuilder } from './QuoteBuilder'
import {
  areas,
  laundry,
  packages,
  servicesList,
  WHATSAPP_DISPLAY,
  whatsappHref,
} from './content'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)

const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`

const BOOK_TEXT =
  'Hi, I would like to book a clean with The Tidy Bee please.'

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [navSolid, setNavSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      autoRaf: false,
      duration: reduced ? 0.6 : 1.15,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      const loader = root.querySelector('.loader')
      if (loader && !reduced) {
        const tl = gsap.timeline({
          onComplete: () => {
            setReady(true)
            document.body.classList.add('is-ready')
          },
        })
        tl.to('.loader-fill', { width: '100%', duration: 1.4, ease: 'power2.inOut' })
          .to('.loader-bee', { rotate: 12, y: -8, duration: 0.4, yoyo: true, repeat: 2 }, 0)
          .to('.loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.1')
      } else {
        gsap.set('.loader', { yPercent: -100 })
        setReady(true)
        document.body.classList.add('is-ready')
      }

      const heroTitle = root.querySelector('.hero-title')
      if (heroTitle && !reduced) {
        try {
          const split = new SplitText(heroTitle, { type: 'chars,words' })
          gsap.from(split.chars, {
            yPercent: 120,
            rotate: 8,
            opacity: 0,
            stagger: 0.028,
            duration: 1.1,
            ease: 'power4.out',
            delay: 1.55,
          })
        } catch {
          gsap.from(heroTitle, { y: 24, opacity: 0, duration: 1, delay: 1.4 })
        }
      }

      gsap.from('.hero-side, .hero-cta, .hero-logo', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.12,
        delay: reduced ? 0 : 1.7,
        ease: 'power3.out',
      })

      gsap.to('.hero-bee', {
        y: 16,
        rotate: 6,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 22,
        ease: 'none',
        repeat: -1,
      })

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.card').forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        })
      })

      const polaroids = gsap.utils.toArray<HTMLElement>('.polaroid')
      polaroids.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          rotate: i % 2 === 0 ? -8 : 10,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
        })
      })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = root.querySelector<HTMLElement>('.pin-track')
        const pin = root.querySelector<HTMLElement>('.pin-wrap')
        if (!track || !pin) return
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })

      gsap.to('.flight-bee', {
        motionPath: {
          path: '#flight-path',
          align: '#flight-path',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      })
    }, root)

    const onScroll = () => setNavSolid(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      ctx.revert()
      document.body.classList.remove('is-ready')
    }
  }, [])

  return (
    <div ref={rootRef} className={ready ? 'site is-ready' : 'site'}>
      <div className="grain" />
      <div className="loader" aria-hidden="true">
        <Bee className="loader-bee" />
        <p>Warming the kettle…</p>
        <div className="loader-bar">
          <span className="loader-fill" />
        </div>
      </div>

      <svg className="flight" viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">
        <path
          id="flight-path"
          d="M78 8 C92 40 18 70 28 110 C40 160 88 170 70 220 C48 280 90 310 62 360 C48 385 40 392 36 398"
          fill="none"
          stroke="none"
        />
      </svg>
      <div className="flight-bee">
        <Bee />
      </div>

      <header className={navSolid ? 'nav is-solid' : 'nav'}>
        <a className="nav-brand" href="#top">
          <img src={brand('logo.jpg')} alt="The Tidy Bee" />
          <span>The Tidy Bee</span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Cleans
          </a>
          <a href="#quote" onClick={() => setMenuOpen(false)}>
            Quote
          </a>
          <a href="#areas" onClick={() => setMenuOpen(false)}>
            Areas
          </a>
          <a href="#book" onClick={() => setMenuOpen(false)}>
            Book
          </a>
        </nav>
        <a className="btn btn-ink nav-cta" href={whatsappHref(BOOK_TEXT)}>
          WhatsApp
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow hero-side">Downpatrick & surrounding areas</p>
            <h1 className="hero-title">Clean homes. Happy spaces. Happier you.</h1>
            <p className="lede hero-side">
              Friendly, reliable & professional domestic cleaning — so you can enjoy what
              matters most.
            </p>
            <div className="hero-cta">
              <a className="btn btn-honey" href={whatsappHref(BOOK_TEXT)}>
                Message to book
              </a>
              <a className="btn btn-ghost" href="#services">
                See the menu
              </a>
            </div>
            <ul className="pills hero-side">
              <li>Reliable</li>
              <li>Trusted</li>
              <li>Thorough</li>
            </ul>
          </div>
          <div className="hero-visual">
            <img className="hero-logo" src={brand('logo.jpg')} alt="The Tidy Bee logo" />
            <Bee className="hero-bee" title="The Tidy Bee mascot" />
            <div className="offer-chip">10% off your first clean</div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, loop) => (
              <p key={loop}>
                Sparkling kitchens · Fresh bathrooms · Beautiful homes · No job too big or too
                small · Local, trusted & here to help ·
              </p>
            ))}
          </div>
        </div>

        <section className="story">
          <div className="story-copy reveal">
            <p className="eyebrow">What I do</p>
            <h2>I’ll take care of the cleaning.</h2>
            <p className="lede">
              Regular visits, one-offs, deep cleans, and move-in / move-out days — all products
              and equipment provided, fully insured, and priced with a local heart.
            </p>
          </div>
          <ul className="check-grid">
            {servicesList.map((item) => (
              <li key={item} className="reveal">
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="services" className="services">
          <div className="pin-wrap">
            <div className="section-head reveal">
              <p className="eyebrow">The menu</p>
              <h2>Pick your kind of tidy.</h2>
            </div>
            <div className="pin-track">
              {packages.map((pkg) => (
                <article key={pkg.id} className={pkg.featured ? 'svc featured' : 'svc'}>
                  {pkg.featured ? <span className="ribbon">Most loved</span> : null}
                  <h3>{pkg.name}</h3>
                  <p>{pkg.blurb}</p>
                  <ul>
                    {pkg.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <strong>from £{pkg.from}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="quote" className="quote-section">
          <QuoteBuilder />
        </section>

        <section className="laundry">
          <div className="reveal">
            <p className="eyebrow">Laundry</p>
            <h2>Wash, dry, fold — and a little extra calm.</h2>
          </div>
          <ul className="laundry-grid">
            {laundry.map((item) => (
              <li key={item.name} className="card">
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="areas" className="areas">
          <div className="reveal">
            <p className="eyebrow">Areas I cover</p>
            <h2>Local, trusted & here to help.</h2>
          </div>
          <ul className="area-pills">
            {areas.map((place) => (
              <li key={place} className="reveal">
                <span className="pin" />
                {place}
              </li>
            ))}
          </ul>
        </section>

        <section className="gallery">
          <div className="section-head reveal">
            <p className="eyebrow">The look</p>
            <h2>Homes that feel like a deep breath.</h2>
          </div>
          <div className="polaroids">
            <figure className="polaroid rot-left">
              <img src={brand('bathroom.jpg')} alt="A bright kitchen and bathroom after a thorough clean" />
              <figcaption>Sparkling kitchens</figcaption>
            </figure>
            <figure className="polaroid rot-right">
              <img src={brand('living.jpg')} alt="A calm living room with fresh linens and plants" />
              <figcaption>Beautiful homes</figcaption>
            </figure>
            <figure className="polaroid">
              <img src={brand('intro-flyer.jpg')} alt="The Tidy Bee introductory flyer" />
              <figcaption>From the studio</figcaption>
            </figure>
          </div>
        </section>

        <section id="book" className="book">
          <div className="book-card reveal">
            <p className="eyebrow">Special offer</p>
            <h2>10% off your first clean.</h2>
            <p className="lede">
              Message The Tidy Bee on WhatsApp to book. She’ll confirm timing, extras, and a
              price that fits the house.
            </p>
            <a className="btn btn-honey" href={whatsappHref(BOOK_TEXT)}>
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <p className="fine">
              Prices may vary depending on the size and condition of the property. All products
              & equipment provided. Fully insured. Thank you for supporting a local business.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="script">The Tidy Bee</p>
        <p>Clean homes · Happy spaces · Happy you</p>
      </footer>
    </div>
  )
}
