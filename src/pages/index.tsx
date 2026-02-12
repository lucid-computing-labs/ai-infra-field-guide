import React from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import NetworkMesh from '../components/NetworkMesh';

const chapters = [
  {
    number: '01',
    title: 'Physical Architecture',
    description: 'Racks, cooling, power delivery. Why 132 kW per rack changes everything about facility design.',
    link: '/docs/physical-architecture',
    accent: '#e65100',
  },
  {
    number: '02',
    title: 'Interconnects',
    description: 'NVLink, InfiniBand, and the invisible boundary between them. The most misunderstood layer.',
    link: '/docs/interconnects',
    accent: '#1565c0',
  },
  {
    number: '03',
    title: 'Cluster Management',
    description: 'Schedulers, orchestration, health monitoring. Keeping thousands of GPUs running as one.',
    link: '/docs/cluster-management',
    accent: '#2e7d32',
  },
  {
    number: '04',
    title: 'Verification Relevance',
    description: 'What can you observe? Attestation surfaces, monitoring boundaries, and governance implications.',
    link: '/docs/verification',
    accent: '#6a1b9a',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero-field-guide">
      <div className="hero-field-guide__mesh-container">
        <NetworkMesh />
      </div>
      <div className="container hero-field-guide__content">
        <Heading as="h1" className="hero-field-guide__title">{siteConfig.title}</Heading>
        <p className="hero-field-guide__subtitle">{siteConfig.tagline}</p>
        <div className="hero-field-guide__stats">
          <div className="hero-field-guide__stat">
            <span className="hero-field-guide__stat-value">4</span>
            <span className="hero-field-guide__stat-label">Chapters</span>
          </div>
          <div className="hero-field-guide__stat-divider" />
          <div className="hero-field-guide__stat">
            <span className="hero-field-guide__stat-value">6</span>
            <span className="hero-field-guide__stat-label">Interactive explorables</span>
          </div>
          <div className="hero-field-guide__stat-divider" />
          <div className="hero-field-guide__stat">
            <span className="hero-field-guide__stat-value">30+</span>
            <span className="hero-field-guide__stat-label">Concept checks</span>
          </div>
        </div>
        <div className="hero-field-guide__actions">
          <Link className="button button--primary button--lg" to="/docs/intro">
            Start Reading
          </Link>
          <Link className="button button--outline button--lg" to="/docs/open-questions">
            Open Questions
          </Link>
          <Link className="button button--outline button--lg" to="/docs/lab-access">
            Lab Access Program
          </Link>
        </div>
        <p className="hero-field-guide__provenance">
          A work in progress. Open source on GitHub.
        </p>
      </div>
    </header>
  );
}

function ChapterRoadmap() {
  return (
    <section className="chapter-roadmap">
      <div className="container">
        <h2 className="chapter-roadmap__heading">The Learning Path</h2>
        <p className="chapter-roadmap__subheading">Four chapters that build on each other, from physical hardware to governance implications.</p>
        <div className="chapter-roadmap__timeline">
          {chapters.map((ch, i) => (
            <Link key={ch.number} to={ch.link} className="chapter-roadmap__item" style={{textDecoration: 'none', color: 'inherit'}}>
              <div className="chapter-roadmap__number" style={{borderColor: ch.accent, color: ch.accent}}>
                {ch.number}
              </div>
              {i < chapters.length - 1 && <div className="chapter-roadmap__connector" />}
              <div className="chapter-roadmap__card">
                <h3 className="chapter-roadmap__card-title">{ch.title}</h3>
                <p className="chapter-roadmap__card-desc">{ch.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActiveLearningCallout() {
  return (
    <section className="active-learning-callout">
      <div className="container">
        <div className="active-learning-callout__inner">
          <h2 className="active-learning-callout__heading">Designed for Active Learning</h2>
          <div className="active-learning-callout__features">
            <div className="active-learning-callout__feature">
              <div className="active-learning-callout__feature-icon">&#x2753;</div>
              <h3>Concept Checks</h3>
              <p>Inline questions every few hundred words that test whether you actually understood the implication, not just the definition.</p>
            </div>
            <div className="active-learning-callout__feature">
              <div className="active-learning-callout__feature-icon">&#x2699;</div>
              <h3>Interactive Explorables</h3>
              <p>Topology explorers, power calculators, visibility maps, and more. Manipulate parameters to build real intuition.</p>
            </div>
            <div className="active-learning-callout__feature">
              <div className="active-learning-callout__feature-icon">&#x1F9E9;</div>
              <h3>Real Scenarios</h3>
              <p>Open-ended problems that connect infrastructure knowledge to verification and governance challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferenceLinks() {
  return (
    <section className="reference-links">
      <div className="container">
        <div className="reference-links__grid">
          <Link to="/docs/cluster-landscape" className="reference-links__card">
            <h3>Cluster Landscape</h3>
            <p>A searchable catalog of the world's largest AI compute clusters with sortable data on operators, GPU counts, power, and networking.</p>
          </Link>
          <Link to="/docs/glossary" className="reference-links__card">
            <h3>Glossary</h3>
            <p>Quick reference for technical terms used throughout the guide, from PUE to NVLink domains.</p>
          </Link>
          <Link to="/docs/open-questions" className="reference-links__card">
            <h3>Open Questions</h3>
            <p>Unsolved problems and research opportunities at the intersection of AI infrastructure and verification.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <ChapterRoadmap />
        <ActiveLearningCallout />
        <ReferenceLinks />
      </main>
    </Layout>
  );
}
