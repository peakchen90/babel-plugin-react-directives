import JsTabs from 'js-tabs';
import debounce from 'lodash/debounce';
import 'js-tabs/dist/main/js-tabs-base.css';
import './style/index.css';

import editors from './editor';
import { renderPreview, updateCSS } from './preview';

function getRenderValues() {
  return {
    js: editors.jsEditor.getValue(),
    css: editors.cssEditor.getValue(),
    options: editors.optionsEditor.getValue()
  };
}

renderPreview(getRenderValues());

editors.cssEditor.onDidChangeModelContent(debounce(() => {
  updateCSS(editors.cssEditor.getValue());
}, 600));
const _renderPreview = debounce(() => {
  renderPreview(getRenderValues());
}, 600);
editors.jsEditor.onDidChangeModelContent(_renderPreview);
editors.optionsEditor.onDidChangeModelContent(_renderPreview);


// init tabs
new JsTabs({ elm: '.left-section' }).init();
new JsTabs({ elm: '.right-section' }).init();
