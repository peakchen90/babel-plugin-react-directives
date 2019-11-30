const a = (
  <div
    style={{
      ...require("babel-plugin-react-directives/runtime/merge-props.js").call(
        this,
        "style",
        [
          {
            style: {
              color: "red"
            }
          }
        ]
      ),
      display: testA ? undefined : "none"
    }}>
    A
  </div>
);
const b = (
  <div
    style={{
      ...require("babel-plugin-react-directives/runtime/merge-props.js").call(
        this,
        "style",
        [
          {
            style: styleA
          }
        ]
      ),
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);
