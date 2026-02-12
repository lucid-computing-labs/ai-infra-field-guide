# Contributing to the AI Infrastructure Field Guide

We welcome contributions from anyone willing to help improve this resource. This document explains how to contribute effectively.

## What We're Looking For

Contributions that add value:
- Specific numbers with sources
- Details from firsthand experience
- Consolidation of scattered public documentation into coherent explanations
- Concrete examples that illuminate abstract concepts
- Corrections to errors or outdated information
- Concept check questions that test real understanding
- Interactive component improvements with accurate data

## What We Need

### Experience and Insights
If you've worked in or with data centers — whether standard colocation, enterprise, or large-scale AI compute facilities — you may have knowledge that's hard to find elsewhere:
- What actually goes wrong (common failure modes, surprising edge cases)
- What the vendor docs don't tell you (practical limitations, configuration gotchas)
- What it's like to be there (physical scale, noise, heat, the experience of operating these systems)

### Technical Corrections
If you find an error — wrong number, outdated spec, incorrect description — please fix it. Include a source.

### Concept Check Questions
Good concept checks test *understanding*, not recall. The reader should need to think, not just remember a fact.

**Good concept check:** "A facility operator discovers that their NVL72 rack is drawing 145 kW instead of the expected 132 kW. What is the most likely cause and what is the immediate risk?"

**Bad concept check:** "How many GPUs are in an NVL72 rack?" (This is trivia — it tests whether you read the number, not whether you understood the implications.)

### Interactive Components
We use React components embedded in MDX pages. If you want to build or improve an interactive:
- File a GitHub issue first describing what you want to build
- Keep dependencies minimal (prefer SVG + vanilla React over heavy charting libraries)
- Ensure data accuracy — wrong numbers in an interactive are worse than no interactive
- Test in both light and dark mode

## How to Contribute

### Small Fixes (Typos, Broken Links, Minor Corrections)
1. Fork the repo
2. Make your change
3. Submit a pull request with a clear description

### Content Contributions (New Sections, Significant Edits)
1. File a GitHub issue describing what you want to add/change
2. Wait for discussion — we may have context that affects the approach
3. Fork and create a branch
4. Write your contribution following the style guide below
5. Submit a pull request

### Style Guide
- **Voice:** Write as if explaining to a smart policy researcher who has never been inside a data center. Be concrete and specific.
- **Numbers:** Use specific numbers, not qualitative descriptions. "132 kW" not "very high power". Include sources.
- **Tradeoffs:** When there are tradeoffs, explain them honestly. Don't advocate for one vendor or approach.
- **Active engagement:** Every major concept should have a concept check or discussion prompt nearby. Passive reading is the enemy.
- **Verification angle:** Every section should connect back to the verification question — what does this mean for observability, monitoring, and governance?

## Development Setup

```bash
git clone https://github.com/lucid-computing-labs/ai-infra-field-guide.git
cd ai-infra-field-guide
npm install
npm start
```

The site uses [Docusaurus](https://docusaurus.io/) with MDX. Content lives in `docs/`. Interactive components live in `src/components/`.

## Code of Conduct

Be professional. Contribute in good faith. Disagree respectfully and with evidence. We're here to build a useful resource, not to score points.
