import { useEffect, useRef, useState } from 'react'

const email = 'hello@aleadingconcept.com'
const sliUrl = 'https://app.aleadingconcept.com/sli'
const Arrow = () => <span aria-hidden="true">↗</span>

const heroSizes = [
  { max: 700, file: 'air_cargo_600' },
  { max: 1100, file: 'air_cargo_1000' },
  { max: 1900, file: 'air_cargo_1600' },
  { max: Infinity, file: 'air_cargo_2400' },
]

const steps = [
  { n: '01', title: 'Submit your SLI', copy: 'Fill out our online Shipper’s Letter of Instruction with origin, destination, cargo details, and timeline. It takes a few minutes.' },
  { n: '02', title: 'We review and quote', copy: 'Our team reviews your submission, reaches out directly, and comes back with a clear quote and routing plan.' },
  { n: '03', title: 'Your cargo moves', copy: 'We coordinate carriers and documentation, then keep you updated from pickup to proof of delivery.' },
]

const marqueeItems = ['JFK → DEL', 'Air freight', 'Customs coordination', 'Shipment visibility', 'Carrier management', 'Direct communication']

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function pickHeroFile() {
  if (typeof window === 'undefined') return 'air_cargo_1600'
  const w = window.innerWidth
  return (heroSizes.find((s) => w <= s.max) || heroSizes[heroSizes.length - 1]).file
}

function useMagnetic(ref, strength = 16) {
  useEffect(() => {
    const el = ref.current
    if (!el || !canHover() || reducedMotion()) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, strength])
}

function CustomCursor() {
  const dotRef = useRef(null)
  const enabled = useRef(typeof window !== 'undefined' && canHover() && !reducedMotion())

  useEffect(() => {
    if (!enabled.current) return
    const dot = dotRef.current
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }
    let raf

    document.body.classList.add('has-custom-cursor')

    const onMove = (e) => { target.x = e.clientX; target.y = e.clientY }
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      if (dot) dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const grow = () => dot?.classList.add('is-active')
    const shrink = () => dot?.classList.remove('is-active')

    const interactive = document.querySelectorAll('a, button')
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  if (!enabled.current) return null
  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
}

function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    let raf = null
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const pct = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`
      raf = null
    }
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [heroSrc, setHeroSrc] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const shellRef = useRef(null)
  const heroRef = useRef(null)
  const primaryButtonRef = useRef(null)
  const navContactRef = useRef(null)
  const emailLinkRef = useRef(null)
  const backToTopRef = useRef(null)

  useMagnetic(primaryButtonRef, 14)
  useMagnetic(navContactRef, 10)
  useMagnetic(emailLinkRef, 12)
  useMagnetic(backToTopRef, 12)

  useEffect(() => {
    const file = pickHeroFile()
    const src = `/assets/${file}.jpg`
    setHeroSrc(src)
    const image = new Image()
    image.fetchPriority = 'high'
    image.src = src
    image.onload = () => setLoaded(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const hero = heroRef.current
    if (!hero) return
    let raf = null
    const update = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
      hero.style.setProperty('--sp', p.toFixed(3))
      raf = null
    }
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!canHover() || reducedMotion()) return
    const shell = shellRef.current
    if (!shell) return
    const onMove = (e) => {
      shell.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
      shell.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal-group')
    if (reducedMotion()) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="site-shell" ref={shellRef}>
      <div className="curtain" aria-hidden="true"><span>ALC</span></div>

      <CustomCursor />
      <ScrollProgress />

      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-image backdrop-low" />
        <div
          className={`backdrop-image backdrop-high ${loaded ? 'is-loaded' : ''}`}
          style={heroSrc ? { backgroundImage: `url(${heroSrc})` } : undefined}
        />
        <div className="backdrop-shade" />
        <div className="grain" />
      </div>

      <header className={`nav-wrap ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="A Leading Concept home">
          <span className="brand-mark">ALC</span>
          <span className="brand-name">A Leading Concept</span>
        </a>
        <a ref={navContactRef} className="nav-contact" href={sliUrl}>Get a quote <Arrow /></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
          <div className="hero-inner">
            <div className="eyebrow"><span /> Now moving cargo · JFK → DEL</div>
            <h1 id="hero-title">Cargo in motion.<br /><em>Handled with intent.</em></h1>
            <p className="hero-copy">International air freight from New York to New Delhi, and anywhere else your cargo needs to go. Send us your shipment details and we’ll get back to you with a quote.</p>
            <div className="hero-actions">
              <a ref={primaryButtonRef} className="primary-button" href={sliUrl}>Get a quote <Arrow /></a>
              <a className="availability" href={`mailto:${email}?subject=Freight%20inquiry`}>Or email us</a>
            </div>
          </div>
          <div className="scroll-note" aria-hidden="true"><span /> Explore</div>
        </section>

        <section className="lane" aria-labelledby="lane-title">
          <div className="lane-card reveal-group">
            <p className="section-kicker">Featured lane</p>
            <h2 id="lane-title" className="lane-route">
              <span><b>JFK</b><small>New York</small></span>
              <i aria-hidden="true">→</i>
              <span><b>DEL</b><small>New Delhi</small></span>
            </h2>
            <p className="lane-copy">JFK to DEL is our featured lane. We know the routings, the carriers, and the paperwork. Shipping somewhere else? We quote other origins and destinations worldwide.</p>
            <a className="primary-button" href={sliUrl}>Start your SLI <Arrow /></a>
          </div>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div className="section-intro reveal-group">
            <p className="section-kicker">What we move forward</p>
            <h2 id="capabilities-title">A focused partner for air freight that cannot stand still.</h2>
          </div>
          <div className="service-grid reveal-group">
            <article><span className="service-number">01</span><h3>International air freight</h3><p>Responsive coordination for cargo moving across borders and time zones.</p></article>
            <article><span className="service-number">02</span><h3>Shipment visibility</h3><p>Clear updates and straightforward communication from origin to destination.</p></article>
            <article><span className="service-number">03</span><h3>Any lane, worldwide</h3><p>JFK to DEL is our specialty, but we can move cargo between most origins and destinations. Just ask.</p></article>
          </div>
        </section>

        <section className="marquee-wrap reveal-group" aria-hidden="true">
          <div className="marquee">
            <div className="marquee-track">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i}>{item}<i /></span>
              ))}
            </div>
          </div>
        </section>

        <section className="process" aria-labelledby="process-title">
          <div className="section-intro reveal-group">
            <p className="section-kicker">How it works</p>
            <h2 id="process-title">From SLI to delivery, without the runaround.</h2>
          </div>
          <div className="process-steps reveal-group">
            {steps.map((step) => (
              <div className="step" key={step.n}>
                <div className="step-line" aria-hidden="true" />
                <span className="step-number">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-panel reveal-group" id="contact" aria-labelledby="contact-title">
          <p className="section-kicker">Your next move</p>
          <h2 id="contact-title">Let’s get your cargo<br />where it needs to go.</h2>
          <p className="contact-copy">Submit an SLI and we’ll review it, reach out, and send you a quote.</p>
          <a className="primary-button contact-button" href={sliUrl}>Submit an SLI <Arrow /></a>
          <a ref={emailLinkRef} className="email-link" href={`mailto:${email}`}>{email} <Arrow /></a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">ALC <span>/</span> A Leading Concept</div>
        <p>Air cargo · JFK → DEL &amp; worldwide</p>
        <div className="footer-meta">
          <p>© {new Date().getFullYear()} A Leading Concept</p>
          <a ref={backToTopRef} className="back-to-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  )
}
