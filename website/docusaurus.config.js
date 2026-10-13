// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Allotment",
  tagline: "Resizable split panes for React, derived from VS Code",
  url: "https://allotment.mulberryhousesoftware.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  favicon: "img/favicon.ico",
  organizationName: "johnwalley", // Usually your GitHub org/user name.
  projectName: "allotment", // Usually your repo name.
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [
            [
              require("@docusaurus/remark-plugin-npm2yarn"),
              { sync: true, converters: ["yarn", "pnpm"] },
            ],
          ],
          sidebarPath: require.resolve("./sidebars.json"),
          editUrl: "https://github.com/johnwalley/allotment/tree/main/website/",
        },
        gtag: {
          trackingID: "G-DNDF9GXNX9",
          anonymizeIP: true,
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themes: [
    "@docusaurus/theme-live-codeblock",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexBlog: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: "img/social-card.png",
      metadata: [
        {
          name: "keywords",
          content: "react, split pane, split view, resizable, panels, vscode",
        },
      ],
      navbar: {
        title: "Allotment",
        logo: {
          alt: "Allotment Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "getting-started",
            position: "left",
            label: "Docs",
          },
          {
            type: "docSidebar",
            sidebarId: "api",
            position: "left",
            label: "API",
          },
          {
            href: "https://github.com/johnwalley/allotment",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting started",
                to: "/docs/getting-started",
              },
              {
                label: "Features",
                to: "/docs/basic",
              },
              {
                label: "API reference",
                to: "/docs/overview",
              },
              {
                label: "FAQ",
                to: "/docs/faq",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/johnwalley/allotment",
              },
              {
                label: "Storybook",
                href: "https://allotment-storybook.netlify.app",
              },
              {
                label: "Changelog",
                href: "https://github.com/johnwalley/allotment/releases",
              },
              {
                label: "npm",
                href: "https://www.npmjs.com/package/allotment",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} John Walley. Built with Docusaurus.`,
      },
      liveCodeBlock: {
        playgroundPosition: "top",
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};

module.exports = config;
