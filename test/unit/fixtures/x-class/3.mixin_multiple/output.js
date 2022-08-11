const a = (
  <div
    {...spreadA}
    className={require("babel-plugin-react-directives/runtime/lib-classnames.js")(
      [
        require("babel-plugin-react-directives/runtime/merge-props.js").call(
          this,
          "className",
          [
            {
              className: "a"
            },
            spreadA
          ]
        ),
        foo
      ]
    )}/>
);

const b = (
  <div
    {...spreadB}
    {...spreadC}
    className={require("babel-plugin-react-directives/runtime/lib-classnames.js")(
      [
        require("babel-plugin-react-directives/runtime/merge-props.js").call(
          this,
          "className",
          [
            {
              className: "b"
            },
            spreadC
          ]
        ),
        bar
      ]
    )}/>
);
