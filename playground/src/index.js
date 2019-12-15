import JsTabs from 'js-tabs';
import debounce from 'lodash/debounce';
import 'js-tabs/dist/main/js-tabs-base.css';
import './style/index.css';
import './style/loading.css';

import editors from './editor';
import { renderPreview, updateCSS } from './preview';

function getRenderValues() {
  return {
    js: editors.jsEditor.getValue(),
    css: editors.cssEditor.getValue(),
    options: editors.optionsEditor.getValue()
  };
}

editors.cssEditor.onDidChangeModelContent(debounce(() => {
  updateCSS(editors.cssEditor.getValue());
}, 600));
const _renderPreview = debounce(() => {
  renderPreview(getRenderValues());
}, 600);
editors.jsEditor.onDidChangeModelContent(_renderPreview);
editors.optionsEditor.onDidChangeModelContent(_renderPreview);

setTimeout(() => {
  renderPreview(getRenderValues());
});

// init tabs
new JsTabs({ elm: '.left-section' }).init();
new JsTabs({ elm: '.right-section' }).init();

// hide app loading
document.querySelector('.app-loading').style.display = 'none';
