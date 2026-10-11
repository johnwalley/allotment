---
id: closable
title: Closable
---

# Closable

Panes can be added and removed by changing the children. Give each pane a stable `key` so Allotment can tell which one changed. The remaining panes are resized to fill the space.

```tsx live
function Panes() {
  const [panes, setPanes] = React.useState([1, 2, 3]);
  const nextId = React.useRef(4);

  const addPane = () => {
    const id = nextId.current++;
    setPanes((panes) => [...panes, id]);
  };

  const closePane = (id: number) => {
    setPanes((panes) => panes.filter((pane) => pane !== id));
  };

  return (
    <>
      <button
        className="button button--secondary button--sm margin-bottom--sm"
        onClick={addPane}
      >
        Add pane
      </button>
      <div style={{ height: 300 }}>
        <Allotment>
          {panes.map((pane) => (
            <Allotment.Pane key={pane}>
              <div className="demo-pane">
                Pane {pane}
                <button
                  className="button button--link button--sm"
                  disabled={panes.length === 1}
                  onClick={() => closePane(pane)}
                >
                  Close
                </button>
              </div>
            </Allotment.Pane>
          ))}
        </Allotment>
      </div>
    </>
  );
}
```

[Open in Storybook](https://allotment-storybook.netlify.app/?path=/story/basic--closable)
