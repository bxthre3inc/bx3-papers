
import Hero from '../components/Hero';

const Home = () => {
  return (
    <>
      <Hero />
      <section style={{ padding: '80px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>
              Why Play Here?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We merge the best visual experiences with provably fair mechanics. Enjoy dynamic
              payouts, immersive soundscapes, and lightning-fast action.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {[
              { title: 'Lightning Fast', desc: 'Instant deposits and withdrawals with zero lag gameplay.' },
              { title: 'Provably Fair', desc: 'Every spin, roll, or shot is cryptographic and verifiable.' },
              { title: 'Premium Design', desc: 'Engage with visually stunning interfaces designed to thrill.' }
            ].map((feature, i) => (
              <div key={i} className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--accent-tertiary)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
