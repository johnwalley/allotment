import { Meta, Story } from "@storybook/react";

import Allotment, { AllotmentProps } from "../src/allotment";
import { range } from "../src/helpers/range";
import styles from "./allotment.stories.module.css";

export default {
  title: "Basic",
  Component: Allotment,
  argTypes: {
    numViews: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
  },
} as Meta;

const Template: Story<AllotmentProps & { numViews: number }> = ({
  numViews,
  ...args
}) => {
  const views = range(0, numViews).map((n) => ({ id: String(n) }));

  return (
    <div className={styles.container}>
      <Allotment {...args}>
        {views.map((view) => (
          <div key={view.id} ref={console.log} className={styles.content}>
            {view.id}
          </div>
        ))}
      </Allotment>
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
      <Allotment minSize={100} snap>
        <Allotment.Pane>
          <div className={styles.content}>
            <Allotment vertical minSize={100}>
              <Allotment.Pane>
                <div ref={console.log} className={styles.content}>
                  One
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <div ref={console.log} className={styles.content}>
                  Two
                </div>
              </Allotment.Pane>
            </Allotment>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className={styles.content}>Three</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
Nested.args = {};
