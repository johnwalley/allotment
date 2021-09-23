import { Meta, Story } from "@storybook/react";

import Banderole, { BanderoleProps } from "../src/banderole";
import { range } from "../src/helpers/range";
import styles from "./banderole.stories.module.css";

export default {
  title: "Basic",
  Component: Banderole,
  argTypes: {
    numViews: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
  },
} as Meta;

const Template: Story<BanderoleProps & { numViews: number }> = ({
  numViews,
  ...args
}) => {
  const views = range(0, numViews).map((n) => ({ id: String(n) }));

  return (
    <div className={styles.container}>
      <Banderole {...args}>
        {views.map((view) => (
          <div key={view.id} ref={console.log} className={styles.content}>
            {view.id}
          </div>
        ))}
      </Banderole>
    </div>
  );
};

export const Vertical = Template.bind({});
Vertical.args = {
  numViews: 2,
  vertical: true,
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  numViews: 3,
  vertical: false,
};

export const Nested: Story = (args) => {
  return (
    <div className={styles.container}>
      <Banderole minSize={100} snap>
        <Banderole.Pane>
          <div className={styles.content}>
            <Banderole vertical minSize={100}>
              <Banderole.Pane>
                <div ref={console.log} className={styles.content}>
                  One
                </div>
              </Banderole.Pane>
              <Banderole.Pane>
                <div ref={console.log} className={styles.content}>
                  Two
                </div>
              </Banderole.Pane>
            </Banderole>
          </div>
        </Banderole.Pane>
        <Banderole.Pane>
          <div className={styles.content}>Three</div>
        </Banderole.Pane>
      </Banderole>
    </div>
  );
};
Nested.args = {};
