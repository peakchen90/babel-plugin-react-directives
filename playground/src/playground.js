import './style/playground.css';

const root = document.getElementById('app');
const previewError = document.querySelector('.preview-render-error');
const renderNull = () => null;

window.__render__ = function render(code) {
  window.__App__ = renderNull;
  previewError.style.display = 'none';

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
  if (err) {
    previewError.style.display = 'block';
    previewError.innerText = err.stack || err.message || 'Unexpected Error.';
  }

  console.error(err);
};
