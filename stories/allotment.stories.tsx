import { Meta, Story } from "@storybook/react";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

import Allotment, { AllotmentHandle, AllotmentProps } from "../src/allotment";
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

export const Simple: Story = () => {
  return (
    <div className={styles.container}>
      <Allotment vertical>
        <div className={styles.content}>Pane 1</div>
        <div className={styles.content}>Pane 2</div>
      </Allotment>
    </div>
  );
};

const Template: Story<AllotmentProps & { numViews: number }> = ({
  numViews,
  ...args
}) => {
  const views = range(0, numViews).map((n) => ({ id: String(n) }));

  return (
    <div className={styles.container}>
      <Allotment {...args}>
        {views.map((view) => (
          <div key={view.id} className={styles.content}>
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

export const PersistSizes: Story<{ numViews: number; vertical: boolean }> = ({
  numViews,
  vertical,
}) => {
  const views = range(0, numViews).map((n) => ({ id: String(n) }));
  const [hasReadFromLocalStorage, setHasReadFromLocalStorage] = useState(false);

  const [sizes, setSizes] = useState<number[]>();

  const handleChange = useMemo(
    () =>
      debounce((sizes) => {
        console.log("write_sizes", sizes);
        localStorage.setItem("sizes", JSON.stringify(sizes));
      }, 100),
    []
  );

  useEffect(() => {
    const value = localStorage.getItem("sizes");

    if (value) {
      console.log("read_sizes", JSON.parse(value));
      setSizes(JSON.parse(value));
    }

    setHasReadFromLocalStorage(true);
  }, []);

  return (
    <div className={styles.container}>
      {hasReadFromLocalStorage && (
        <Allotment
          vertical={vertical}
          onChange={handleChange}
          defaultSizes={sizes}
        >
          {views.map((view) => (
            <div key={view.id} className={styles.content}>
              {view.id}
            </div>
          ))}
        </Allotment>
      )}
    </div>
  );
};
PersistSizes.args = {
  numViews: 3,
  vertical: true,
};

export const Nested: Story = () => {
  return (
    <div className={styles.container} style={{ minHeight: 200, minWidth: 200 }}>
      <Allotment minSize={100}>
        <Allotment.Pane maxSize={400}>
          <div className={styles.content}>
            <Allotment vertical>
              <Allotment.Pane minSize={100}>
                <div className={styles.content}>One</div>
              </Allotment.Pane>
              <Allotment.Pane snap>
                <div className={styles.content}>Two</div>
              </Allotment.Pane>
              <Allotment.Pane snap>
                <div className={styles.content}>Three</div>
              </Allotment.Pane>
            </Allotment>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className={styles.content}>Four</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
Nested.args = {};

export const Closable: Story = () => {
  const [panes, setPanes] = useState([0, 1, 2]);

  return (
    <div className={styles.container} style={{ minHeight: 200, minWidth: 200 }}>
      <Allotment vertical minSize={100}>
        <Allotment.Pane maxSize={400}>
          <div className={styles.content}>
            <Allotment>
              {panes.map((pane) => (
                <Allotment.Pane key={pane}>
                  <div className={styles.content}>{pane}</div>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, right: 0 }}>
                      <button
                        onClick={() =>
                          setPanes((panes) => {
                            const newPanes = [...panes];
                            newPanes.splice(pane, 1);
                            return newPanes;
                          })
                        }
                      >
                        x
                      </button>
                    </div>
                  </div>
                </Allotment.Pane>
              ))}
            </Allotment>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div className={styles.content}>Four</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};
Closable.args = {};

export const Reset: Story<AllotmentProps> = (args) => {
  const ref = useRef<AllotmentHandle>(null!);

  return (
    <div>
      <button
        onClick={() => {
          ref.current.reset();
        }}
      >
        Reset
      </button>
      <div className={styles.container}>
        <Allotment ref={ref} {...args}>
          <div className={styles.content}>One</div>
          <div className={styles.content}>Two</div>
        </Allotment>
      </div>
    </div>
  );
};
Reset.args = {};

export const DefaultSize: Story<AllotmentProps> = (args) => {
  return (
    <div className={styles.container}>
      <Allotment {...args}>
        <div className={styles.content}>div1</div>
        <div className={styles.content}>div2</div>
      </Allotment>
    </div>
  );
};
DefaultSize.args = {
  defaultSizes: [200, 400],
};

export const ConfigureSash: Story<AllotmentProps> = (args) => {
  return (
    <div className={styles.container}>
      <Allotment {...args}>
        <div className={styles.content}>div1</div>
        <div className={styles.content}>div2</div>
      </Allotment>
    </div>
  );
};
ConfigureSash.args = {
  sashSize: 4,
};
