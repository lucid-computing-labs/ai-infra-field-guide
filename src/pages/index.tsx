import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero-field-guide">
      <div className="container">
        <Heading as="h1">{siteConfig.title}</Heading>
        <p className="hero-field-guide__subtitle">{siteConfig.tagline}</p>
        <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Start Reading
          </Link>
          <Link className="button button--outline button--lg" to="/docs/open-questions">
            Open Questions
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Physical Architecture',
    description: 'Racks, cooling, power delivery. Why modern AI clusters look nothing like traditional data centers, and what 132 kW per rack actually means.',
    link: '/docs/physical-architecture',
  },
  {
    title: 'Interconnects',
    description: 'NVLink, InfiniBand, and the invisible boundary between them. The most misunderstood layer of AI infrastructure.',
    link: '/docs/interconnects',
  },
  {
    title: 'Cluster Management',
    description: 'Schedulers, orchestration, health monitoring, and the software that keeps thousands of GPUs running a single training job.',
    link: '/docs/cluster-management',
  },
  {
    title: 'Verification Relevance',
    description: 'What can you actually observe? Attestation surfaces, monitoring boundaries, and what this all means for AI governance.',
    link: '/docs/verification',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <div className="features-grid">
          {features.map((f, i) => (
            <Link key={i} to={f.link} className="feature-card" style={{textDecoration: 'none', color: 'inherit'}}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </Link>
          ))}
        </div>
        <div style={{textAlign: 'center', padding: '2rem', maxWidth: 700, margin: '0 auto'}}>
          <p style={{fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--ifm-color-emphasis-600)'}}>
            This guide is designed for active learning. You'll find concept checks every few hundred words,
            interactive explorables you can manipulate, and open-ended scenarios that connect infrastructure
            to real verification problems. Passive reading doesn't work — the discomfort of testing yourself is where the learning happens.
          </p>
        </div>
      </main>
    </Layout>
  );
}
