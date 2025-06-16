import { Meta, Story } from "@storybook/react";
import { debounce } from "lodash";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

import {
  Allotment,
  AllotmentHandle,
  AllotmentProps,
  setSashSize,
} from "../src";
import { range } from "../src/helpers/array";
import styles from "./basic.stories.module.css";
import { Content } from "./content";

export default {
  title: "Basic",
  Component: Allotment,
} as Meta;

export const Simple: Story = () => (
  <div className={styles.container}>
    <Allotment vertical>
      <Content />
      <Content />
    </Allotment>
  </div>
);

const Template: Story<AllotmentProps & { numViews: number }> = ({
  numViews,
  ...args
}) => {
  const views = range(0, numViews).map((n) => ({ id: String(n) }));

  return (
    <div className={styles.container}>
      <Allotment {...args}>
        {views.map((view) => (
          <Content key={view.id} />
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
    [],
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
            <Content key={view.id} />
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
          <Allotment vertical>
            <Allotment.Pane minSize={100}>
              <Content />
            </Allotment.Pane>
            <Allotment.Pane snap>
              <Content />
            </Allotment.Pane>
            <Allotment.Pane snap>
              <Content />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane>
          <Content />
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
        {panes.length !== 0 ? (
          <Allotment.Pane maxSize={400}>
            <Allotment>
              {panes.map((pane) => (
                <Allotment.Pane key={pane}>
                  <Content />
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
                        type="button"
                        onClick={() =>
                          setPanes((panes) => {
                            const newPanes = [...panes];
                            const index = newPanes.indexOf(pane);
                            newPanes.splice(index, 1);
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
          </Allotment.Pane>
        ) : null}
        <Allotment.Pane>
          <Content />
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
        className={styles.button}
        type="button"
        onClick={() => {
          ref.current.reset();
        }}
      >
        Reset
      </button>
      <div className={styles.container}>
        <Allotment ref={ref} {...args}>
          <Content />
          <Content />
        </Allotment>
      </div>
    </div>
  );
};
Reset.args = {};

export const CustomReset: Story<AllotmentProps> = (args) => {
  const ref = useRef<AllotmentHandle>(null!);

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          ref.current.reset();
        }}
      >
        Reset
      </button>
      <div className={styles.container}>
        <Allotment
          ref={ref}
          {...args}
          onReset={() => {
            ref.current.resize([200, 100]);
          }}
        >
          <Content />
          <Content />
        </Allotment>
      </div>
    </div>
  );
};
CustomReset.args = {};

export const Resize: Story<AllotmentProps> = (args) => {
  const defaultSizes = [60, 40];
  const [sizes, setSizes] = useState(defaultSizes);
  const ref = useRef<AllotmentHandle>(null!);

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          const w = Math.floor(100 * Math.random());

          const sizes = [w, 100 - w];
          ref.current.resize(sizes);
          setSizes(sizes);
        }}
      >
        Resize
      </button>
      <pre>
        <code>{JSON.stringify(sizes)}</code>
      </pre>
      <div className={styles.container}>
        <Allotment ref={ref} defaultSizes={defaultSizes} {...args}>
          <Content />
          <Content />
        </Allotment>
      </div>
    </div>
  );
};
Resize.args = {
  minSize: 0,
  maxSize: Number.POSITIVE_INFINITY,
};

export const DefaultSize: Story<AllotmentProps> = (args) => {
  return (
    <div className={styles.container}>
      <Allotment {...args}>
        <Content />
        <Content />
      </Allotment>
    </div>
  );
};
DefaultSize.args = {
  defaultSizes: [200, 400],
};

export const ConfigureSash: Story = ({ sashSize, ...args }) => {
  useEffect(() => {
    setSashSize(sashSize);
  }, [sashSize]);

  return (
    <div className={styles.container}>
      <Allotment {...args}>
        <Content />
        <Content />
      </Allotment>
    </div>
  );
};
ConfigureSash.args = {
  sashSize: 4,
};

export const PaneClassName: Story = (args) => {
  return (
    <div className={styles.container}>
      <Allotment {...args}>
        <Allotment.Pane className={styles.customPane}>
          <div className={styles.customPaneContent}>div1</div>
        </Allotment.Pane>
        <Allotment.Pane>
          <Content />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export const Visible: Story<AllotmentProps> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          setVisible((visible) => !visible);
        }}
      >
        {visible ? "Hide" : "Show"}
      </button>
      <div className={styles.container}>
        <Allotment
          {...args}
          snap
          onVisibleChange={(_index, value) => {
            setVisible(value);
          }}
        >
          <Content />
          <Allotment.Pane visible={visible}>
            <Content />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
Visible.args = {};

export const VisibleWithAnimation: Story<AllotmentProps> = (args) => {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          setVisible((visible) => !visible);
        }}
      >
        {visible ? "Hide" : "Show"}
      </button>
      <div className={styles.container}>
        <Allotment
          {...args}
          className={styles.splitViewContainer}
          snap
          onVisibleChange={(_index, value) => {
            setVisible(value);
          }}
        >
          <Allotment.Pane visible={visible} className={styles.leftPane}>
            <Content />
          </Allotment.Pane>
          <Allotment.Pane className={styles.rightPane}>
            <Content />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
VisibleWithAnimation.args = {};

export const OnReset: Story = (args) => {
  const ref = useRef<AllotmentHandle>(null!);

  const handleReset = () => {
    ref.current.resize([100, 200]);
  };

  return (
    <div className={styles.container}>
      <Allotment ref={ref} {...args} onReset={handleReset}>
        <Content />
        <Content />
      </Allotment>
    </div>
  );
};
OnReset.args = {};

export const FixedSize: Story = (args) => {
  return (
    <div className={styles.container}>
      <Allotment>
        <Allotment.Pane minSize={48} maxSize={48}>
          <Content />
        </Allotment.Pane>
        <Content />
      </Allotment>
    </div>
  );
};
FixedSize.args = {};

export const PreferredSize: Story = (args) => {
  const ref = useRef<AllotmentHandle>(null!);
  const [preferredSize, setPreferredSize] = useState(100);

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          ref.current.reset();
        }}
      >
        Reset
      </button>
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          setPreferredSize(Math.round(200 * Math.random()));
        }}
      >
        {`Random preferredSize: ${preferredSize}`}
      </button>
      <div className={styles.container}>
        <Allotment ref={ref}>
          <Allotment.Pane preferredSize={"20%"}>
            <Content />
          </Allotment.Pane>
          <Allotment.Pane>
            <Content />
          </Allotment.Pane>
          <Allotment.Pane preferredSize={preferredSize}>
            <Content></Content>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
PreferredSize.args = {};

export const NoSeparator: Story = ({ separator }) => (
  <div className={styles.container}>
    <Allotment vertical separator={separator}>
      <Content />
      <Content />
    </Allotment>
  </div>
);
NoSeparator.args = {
  separator: false,
};

export const MeasureSize: Story = () => {
  const [count, setCount] = useState(0);

  const containerRef = useRef(null!);
  const paneRef = useRef(null!);

  const { width: containerWidth, height: containerHeight } =
    useResizeObserver<HTMLDivElement>({ ref: containerRef });

  const { width: paneWidth, height: paneHeight } =
    useResizeObserver<HTMLDivElement>({ ref: paneRef });

  return (
    <div>
      <div>
        Container dimensions: {containerWidth} x {containerHeight}
      </div>
      <div>
        Pane dimensions: {paneWidth} x {paneHeight}
      </div>
      <div
        className={styles.container}
        style={{ minHeight: 200, minWidth: 200 }}
        ref={containerRef}
      >
        <Allotment
          minSize={100}
          onChange={() => setCount((count) => count + 1)}
        >
          <Allotment.Pane maxSize={400}>
            <Allotment vertical>
              <Allotment.Pane minSize={100} ref={paneRef}>
                <Content />
              </Allotment.Pane>
              <Allotment.Pane snap>
                <Content />
              </Allotment.Pane>
              <Allotment.Pane snap>
                <Content />
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane>
            <Content />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
Nested.args = {};

function useManualSuspense() {
  const [suspend, setSuspend] = useState(false);

  const triggerSuspense = (ms: number = 1000) => {
    setSuspend(true);
    setTimeout(() => setSuspend(false), ms);
  };

  if (suspend) {
    throw new Promise(() => {});
  }

  return triggerSuspense;
}

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
  const triggerSuspense = useManualSuspense();

  return (
    <div>
      <button
        className={styles.button}
        type="button"
        onClick={() => triggerSuspense()}
      >
        Trigger Suspense
      </button>
      {children}
    </div>
  );
};

export const WithSuspense: Story = () => {
  return (
    <Suspense fallback={"loading..."}>
      <Wrapper>
        <div className={styles.container}>
          <Allotment vertical>
            <Content />
            <Content />
          </Allotment>
        </div>
      </Wrapper>
    </Suspense>
  );
};
