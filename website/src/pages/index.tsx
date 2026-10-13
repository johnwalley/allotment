import "@vscode/codicons/dist/codicon.css";

import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React, { useState } from "react";

import HomepageFeatures from "../components/HomepageFeatures";
import HomepageProps from "../components/HomepageProps";
import styles from "./index.module.css";

const INSTALL_COMMAND = "npm install allotment";

const QUICK_START = `import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const App = () => (
  <div style={{ height: 400 }}>
    <Allotment>
      <Sidebar />
      <Editor />
    </Allotment>
  </div>
);`;

const BADGES = [
  {
    alt: "npm version",
    src: "https://img.shields.io/npm/v/allotment",
    href: "https://www.npmjs.com/package/allotment",
  },
  {
    alt: "npm downloads per week",
    src: "https://img.shields.io/npm/dw/allotment",
    href: "https://www.npmjs.com/package/allotment",
  },
  {
    alt: "Bundle size",
    src: "https://img.shields.io/bundlephobia/minzip/allotment",
    href: "https://bundlephobia.com/package/allotment",
  },
  {
    alt: "Types included",
    src: "https://img.shields.io/npm/types/allotment",
    href: "https://www.npmjs.com/package/allotment",
  },
  {
    alt: "License",
    src: "https://img.shields.io/github/license/johnwalley/allotment",
    href: "https://github.com/johnwalley/allotment/blob/main/LICENSE",
  },
];

// Open source projects that render Allotment in their UI, checked October 2026
const USED_BY = [
  { name: "JSON Crack", href: "https://github.com/AykutSarac/jsoncrack.com" },
  { name: "CesiumJS", href: "https://github.com/CesiumGS/cesium" },
  {
    name: "Data Formulator",
    href: "https://github.com/microsoft/data-formulator",
  },
  { name: "FiftyOne", href: "https://github.com/voxel51/fiftyone" },
  {
    name: "Azure Cosmos DB Explorer",
    href: "https://github.com/Azure/cosmos-explorer",
  },
  { name: "Convex Chef", href: "https://github.com/get-convex/chef" },
];

// Same shape and colours as the demo, so the page doesn't jump when it loads
function DemoPlaceholder() {
  return (
    <div className={styles.demoPlaceholder} aria-hidden="true">
      <div className={styles.demoPlaceholderTitlebar} />
      <div className={styles.demoPlaceholderStatusbar} />
    </div>
  );
}

function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked, in which case the text is still selectable
    }
  };

  return (
    <div className={styles.install}>
      <code className={styles.installCommand}>
        <span className={styles.installPrompt}>$</span> {INSTALL_COMMAND}
      </code>
      <button
        type="button"
        className={styles.installCopy}
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
        title={copied ? "Copied" : "Copy"}
      >
        <span
          className={clsx("codicon", copied ? "codicon-check" : "codicon-copy")}
        />
      </button>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.heroDemo}>
          <BrowserOnly fallback={<DemoPlaceholder />}>
            {() => {
              const LibComponent = require("../components/app").App;
              return <LibComponent />;
            }}
          </BrowserOnly>
        </div>
        <p className={styles.demoCaption}>
          This is Allotment. Drag the edges, double-click them to reset, and use
          the buttons in the title bar to show and hide panes.
        </p>
        <div className={styles.actions}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get started
          </Link>
          <Link
            className={clsx(
              "button button--outline button--lg",
              styles.examplesButton,
            )}
            to="/docs/basic"
          >
            Features
          </Link>
        </div>
        <InstallCommand />
        <div className={styles.badges}>
          {BADGES.map((badge) => (
            <a key={badge.alt} href={badge.href}>
              <img src={badge.src} alt={badge.alt} height={20} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function UsedBy() {
  return (
    <section className={styles.usedBy}>
      <div className="container">
        <p>
          Used in{" "}
          <a href="https://github.com/johnwalley/allotment/network/dependents">
            over 1,700 repositories on GitHub
          </a>
          , including
        </p>
        <ul className={styles.usedByList}>
          {USED_BY.map((project) => (
            <li key={project.name}>
              <a href={project.href}>{project.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className="row">
          <div className="col col--5">
            <h2>Up and running in a minute</h2>
            <ol className={styles.steps}>
              <li>
                Install <code>allotment</code>. It works with React 17, 18 and
                19.
              </li>
              <li>
                Import the component and its stylesheet,{" "}
                <code>allotment/dist/style.css</code>.
              </li>
              <li>
                Put your panes inside <code>Allotment</code>, in a parent with a
                height.
              </li>
            </ol>
            <Link to="/docs/getting-started">
              Read the getting started guide →
            </Link>
          </div>
          <div className="col col--7">
            <CodeBlock language="tsx">{QUICK_START}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <UsedBy />
        <QuickStart />
        <HomepageProps />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
