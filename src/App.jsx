import { useEffect, useState } from 'react'

const email = 'hello@aleadingconcept.com'
const Arrow = () => <span aria-hidden="true">↗</span>

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const image = new Image()
    image.src = '/assets/air_cargo.jpg'
    image.onload = () => setLoaded(true)
  }, [])

  return (
    <div className="site-shell">
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop-image backdrop-low" />
        <div className={`backdrop-image backdrop-high ${loaded ? 'is-loaded' : ''}`} />
        <div className="backdrop-shade" />
        <div className="grain" />
      </div>

      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="A Leading Concept home">
          <span className="brand-mark">ALC</span>
          <span className="brand-name">A Leading Concept</span>
        </a>
        <a className="nav-contact" href={`mailto:${email}`}>Start a conversation <Arrow /></a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow"><span /> Independent freight forwarding</div>
          <h1 id="hero-title">Cargo in motion.<br /><em>Handled with intent.</em></h1>
          <p className="hero-copy">ALC is an international air cargo partner built around clear communication, careful coordination, and forward momentum.</p>
          <div className="hero-actions">
            <a className="primary-button" href={`mailto:${email}?subject=Freight%20inquiry`}>Talk to ALC <Arrow /></a>
            <span className="availability">Global reach · Direct attention</span>
          </div>
          <div className="scroll-note" aria-hidden="true"><span /> Explore</div>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div className="section-intro">
            <p className="section-kicker">What we move forward</p>
            <h2 id="capabilities-title">A focused partner for air freight that cannot stand still.</h2>
          </div>
          <div className="service-grid">
            <article><span className="service-number">01</span><h3>International air freight</h3><p>Responsive coordination for cargo moving across borders and time zones.</p></article>
            <article><span className="service-number">02</span><h3>Shipment visibility</h3><p>Clear updates and straightforward communication from origin to destination.</p></article>
            <article><span className="service-number">03</span><h3>Personal attention</h3><p>A direct, adaptable approach shaped around the needs of each movement.</p></article>
          </div>
        </section>

        <section className="contact-panel" id="contact" aria-labelledby="contact-title">
          <p className="section-kicker">Your next move</p>
          <h2 id="contact-title">Let’s get your cargo<br />where it needs to go.</h2>
          <a className="email-link" href={`mailto:${email}`}>{email} <Arrow /></a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">ALC <span>/</span> A Leading Concept</div>
        <p>International air cargo coordination</p>
        <p>© {new Date().getFullYear()} A Leading Concept</p>
      </footer>
    </div>
  )
}
