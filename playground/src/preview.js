const preview = document.querySelector('.preview-render');

let style = null;
let ready = false;
let previewWindow = null;
let previewDocument = null;
let _autoRender = null;

// deyay load
preview.src = './playground.html';

preview.addEventListener('load', () => {
  ready = true;
  previewWindow = preview.contentWindow;
  previewDocument = preview.contentWindow.document;
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
    const { code } = Babel.transform(js, {
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
