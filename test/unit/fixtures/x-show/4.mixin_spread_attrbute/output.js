const a = (
  <div
    {...spreadA}
    style={{
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "style",
        [spreadA]
      ),
      display: testA ? undefined : "none"
    }}>
    A
  </div>
);

const b = (
  <div
    {...spreadBa}
    {...spreadBb}
    style={{
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "style",
        [spreadBa, spreadBb]
      ),
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);
