import { transformRuntime } from './runtime';
import './style/playground.css';
import './style/loading.css';

const root = document.getElementById('app');
const previewError = document.querySelector('.preview-render-error');
const renderNull = () => null;

function transformCode(code) {
  code = transformRuntime(code);
  code = code.replace(/export[\s\S]+default/g, 'window.__App__ =');
  code = code.replace(/module\.exports/g, 'window.__App__');
  code = code.replace(/export/g, '');

  return code;
}

window.__render__ = function render(code) {
  window.__App__ = renderNull;
  previewError.style.display = 'none';

  try {
    // eslint-disable-next-line no-eval
    eval(transformCode(code));

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
    previewError.innerText = typeof err.toString === 'function'
      ? err.toString()
      : 'Error: unknown exception';
  }

  console.error(err);
};

// hide app loading
document.querySelector('.app-loading').style.display = 'none';
