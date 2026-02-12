import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AI Infrastructure Field Guide',
  tagline: 'An attempt to create a quick, community tutorial on modern AI clusters — for verification researchers, governance professionals, and the technically curious.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://lucid-computing-labs.github.io',
  baseUrl: '/ai-infra-field-guide/',

  organizationName: 'lucid-computing-labs',
  projectName: 'ai-infra-field-guide',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/lucid-computing-labs/ai-infra-field-guide/edit/main/',
          remarkPlugins: [],
          rehypePlugins: [],
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AI Infra Field Guide',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          to: '/docs/cluster-landscape',
          label: 'Cluster Landscape',
          position: 'left',
        },
        {
          to: '/docs/open-questions',
          label: 'Open Questions',
          position: 'left',
        },
        {
          to: '/docs/lab-access',
          label: 'Lab Access',
          position: 'left',
        },
        {
          to: '/docs/resources',
          label: 'Resources',
          position: 'left',
        },
        {
          href: 'https://github.com/lucid-computing-labs/ai-infra-field-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guide',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Interconnects',
              to: '/docs/interconnects',
            },
            {
              label: 'Open Questions',
              to: '/docs/open-questions',
            },
            {
              label: 'Lab Access',
              to: '/docs/lab-access',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lucid-computing-labs/ai-infra-field-guide',
            },
            {
              label: 'Contribute',
              href: 'https://github.com/lucid-computing-labs/ai-infra-field-guide/blob/main/CONTRIBUTING.md',
            },
          ],
        },
      ],
      copyright: `Lucid Computing · Apache 2.0 License · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
