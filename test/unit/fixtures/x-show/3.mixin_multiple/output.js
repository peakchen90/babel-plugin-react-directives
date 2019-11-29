const a = (
  <div
    {...spreadA}
    style={{
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "style",
        [
          {
            style: styleA
          },
          spreadA
        ]
      ),
      display: testA ? undefined : "none"
    }}>
    A
  </div>
);

const b = (
  <div
    {...spreadB}
    style={{
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "style",
        [
          {
            style: styleB
          }
        ]
      ),
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);
