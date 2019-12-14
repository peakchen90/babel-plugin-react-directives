import runtimeResolver from './runtime';

const preview = document.querySelector('.preview-render');

let style = null;
let ready = false;
let previewWindow = null;
let previewDocument = null;
let _autoRender = null;

preview.addEventListener('load', () => {
  ready = true;
  previewWindow = preview.contentWindow;
  previewDocument = preview.contentWindow.document;
  document.querySelector('.preview-render-loading').style.display = 'none';
  if (typeof _autoRender === 'function') {
    _autoRender();
  }
});

export function updateCSS(css = '') {
  if (!style) {
    style = previewDocument.getElementById('style');
  }
  style.innerHTML = css;
}

function render(js, options) {
  try {
    let { code } = Babel.transform(js, {
      presets: [
        Babel.availablePresets.es2017,
        Babel.availablePresets.react
      ],
      plugins: [
        [require('../../src/index'), JSON.parse(options)],
        Babel.availablePlugins['proposal-object-rest-spread'],
        Babel.availablePlugins['proposal-class-properties'],
      ]
    });

    runtimeResolver.forEach((item) => {
      code = code.replace(item.code, item.resolve);
    });

    code = code.replace(/export[\s\S]+default/g, 'window.__App__ =');
    code = code.replace(/export/g, '');
    code = code.replace(/module.exports/g, 'window.__App__');

    previewWindow.__render__(code);
  } catch (e) {
    previewWindow.__catchError__(e);
  }
}

export function renderPreview({ js, css, options }) {
  if (ready) {
    render(js, options);
    updateCSS(css);
  } else {
    _autoRender = () => {
      render(js, options);
      updateCSS(css);
    };
  }
}
