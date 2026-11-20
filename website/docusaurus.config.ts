import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const docsContentPath = process.env.FP_DOCS_PATH ?? '../../fp-validated-docs/website/docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'FP Validated Docs',
  tagline:
    'Public infrastructure, protocol deployment, and developer integration guides for institution-grade blockchain operations',
  favicon: 'img/symbol.svg',

  stylesheets: [
    {
      rel: 'stylesheet',
      as: 'style',
      crossOrigin: 'anonymous',
      href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
      type: 'text/css',
    },
  ],

  future: {
    v4: true,
  },

  markdown: {
    mermaid: true,
    // `future.v4` turns MDX v1 compatibility off, but the docs use the `:::type Title` admonition form.
    mdx1Compat: {
      admonitions: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  url: 'https://docs.validated.4pillars.io',
  baseUrl: '/',

  organizationName: 'fourpillars',
  projectName: 'fp-validated-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: docsContentPath,
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/FP-Validated/fp-validated-docs/tree/main/website/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'FP Validated Docs',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
        width: 150,
      },
      items: [],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Home', to: '/'},
            {label: 'FP Validated Infrastructure', to: '/fp-validated-infra/overview'},
            {label: 'Staking', to: '/staking'},
            {label: 'Chains', to: '/chains'},
            {label: 'Developer', to: '/developer/api-design-principles'},
            {label: 'Node Operations', to: '/operations/common-runbooks'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Chain Matrix', to: '/reference/chain-matrix'},
            {label: 'RPC / API Matrix', to: '/reference/rpc-api-matrix'},
            {label: 'Glossary', to: '/reference/glossary'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/fourpillars/fp-validated-docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FP Validated Docs.`,
    },
    prism: {
      theme: prismThemes.ultramin,
      darkTheme: prismThemes.ultramin,
      additionalLanguages: ['bash', 'json', 'toml', 'yaml', 'python', 'protobuf', 'graphql', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
