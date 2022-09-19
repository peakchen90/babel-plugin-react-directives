const a = (
  <div
    {...spreadA}
    style={{
      ...require("react-directives-runtime/merge-props.js").call(
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
      ...require("react-directives-runtime/merge-props.js").call(
        this,
        "style",
        [spreadBa, spreadBb]
      ),
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);
