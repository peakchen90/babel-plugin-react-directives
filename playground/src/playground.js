const root = document.getElementById('app');
const renderNull = () => null;

window.__render__ = function render(code) {
  window.__App__ = renderNull;

  try {
    // eslint-disable-next-line no-eval
    eval(code);

    ReactDOM.render(
      React.createElement(window.__App__),
      root
    );
  } catch (e) {
    window.__catchError__(e);
  }
};

window.__catchError__ = function catchError(err) {
  console.error(err);
};
