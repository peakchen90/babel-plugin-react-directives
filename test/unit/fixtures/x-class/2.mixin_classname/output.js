const a = (
  <div
    className={require("babel-plugin-react-directives/runtime/lib-classnames.js")(
      [
        require("babel-plugin-react-directives/runtime/merge-props.js").call(
          this,
          "className",
          [
            {
              className: "a"
            }
          ]
        ),
        "foo"
      ]
    )}/>
);
