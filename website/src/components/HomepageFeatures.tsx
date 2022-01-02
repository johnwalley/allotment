/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "React-based",
    image: "/img/react_icon.svg",
    description: (
      <>Integrate effortlessly into your existing React-based application.</>
    ),
  },
  {
    title: "Industry standard look and feel",
    image: "/img/vscode.svg",
    description: (
      <>
        Like VS Code's split view implementation? You're in luck! This component
        is derived from the same codebase.
      </>
    ),
  },
  {
    title: "Dynamic",
    image: "/img/dynamic.svg",
    description: (
      <>Want to declaratively add and remove panes? We've got you covered.</>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
