# AI Infrastructure Field Guide

**An attempt to create a quick, community tutorial on modern AI clusters — for verification researchers, governance professionals, and the technically curious.**

[Read the Field Guide](https://lucid-computing-labs.github.io/ai-infra-field-guide/) | [Open Questions](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/open-questions) | [Contribute](./CONTRIBUTING.md)

---

## What This Is

An open-source, web-published tutorial on next-generation AI cluster architecture. The audience is people who need to deeply understand modern AI infrastructure but don't have time to read 50 vendor whitepapers.

This is **not** a collection of slides with bullet points. It's designed for active learning:

- **Concept checks** every ~500 words force retrieval practice. You can't passively skim.
- **Interactive explorables** let you manipulate parameters and build intuition that static text can't provide.
- **"What Would You Do?" scenarios** connect infrastructure knowledge to real verification and governance problems.

## Contents

| Chapter | Topic | Status |
|---------|-------|--------|
| [Introduction](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/intro) | How to use this guide, philosophy, audience | Draft |
| [01 — Physical Architecture](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/physical-architecture) | Racks, cooling, power delivery | Draft |
| [02 — Interconnects](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/interconnects) | NVLink, InfiniBand, topology, verification boundaries | Draft |
| [03 — Cluster Management](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/cluster-management) | Schedulers, health monitoring, failure recovery | Draft |
| [04 — Verification Relevance](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/verification) | Observability, attestation surfaces, governance implications | Draft |
| [Glossary](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/glossary) | Key terms | Draft |
| [Open Questions](https://lucid-computing-labs.github.io/ai-infra-field-guide/docs/open-questions) | Unsolved problems where we need help | Draft |

## Interactive Components

The guide includes React-based interactive components embedded in the content:

- **Cluster Topology Explorer** — Navigate from a single GPU through NVLink domain, NVL72 rack, SuperPOD, to full cluster. See how bandwidth, latency, and observability change at each level.
- **Power Density Timeline** — (Planned) Slide from A100 to Rubin and watch cooling requirements cascade.
- **Network Visibility Map** — (Planned) Place verification probes and see which traffic flows are visible vs. invisible.
- **FLOP Accounting Calculator** — (Planned) Input model parameters, output estimated compute requirements.

## Running Locally

```bash
# Clone the repo
git clone https://github.com/lucid-computing-labs/ai-infra-field-guide.git
cd ai-infra-field-guide

# Install dependencies
npm install

# Start development server
npm start
```

The site will be available at `http://localhost:3000/ai-infra-field-guide/`.

## Building for Production

```bash
npm run build
```

Static output goes to `build/`. Deploy anywhere that serves static files.

## How This Was Made

This is a collaboration between humans and AI tools. The prose was drafted with AI assistance and edited by humans. Interactive components were built with AI coding tools.

We're trying to be honest about what we know and don't know. This guide is incomplete and probably wrong in places — we're publishing it anyway because imperfect documentation beats no documentation.

## Contributing

We welcome contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is open source. See [LICENSE](./LICENSE) for details.

## About

Built by [Lucid Labs](https://github.com/lucid-computing-labs), the research arm of Lucid Computing.
