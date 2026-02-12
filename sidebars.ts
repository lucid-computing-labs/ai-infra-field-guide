import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    'intro',
    {
      type: 'category',
      label: '01 — Physical Architecture',
      link: {type: 'doc', id: 'physical-architecture/index'},
      items: [],
    },
    {
      type: 'category',
      label: '02 — Interconnects',
      link: {type: 'doc', id: 'interconnects/index'},
      items: [],
    },
    {
      type: 'category',
      label: '03 — Cluster Management',
      link: {type: 'doc', id: 'cluster-management/index'},
      items: [],
    },
    {
      type: 'category',
      label: '04 — Verification Relevance',
      link: {type: 'doc', id: 'verification/index'},
      items: [],
    },
    'glossary',
    'cluster-landscape',
    'open-questions',
    'lab-access',
    'resources',
  ],
};

export default sidebars;
