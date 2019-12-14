import JsTabs from 'js-tabs';
import 'js-tabs/dist/main/js-tabs-base.css';
import './index.css';

import editors from './editor';
import { renderPreview } from './preview';

document.querySelector('.run-btn').addEventListener('click', () => {
  renderPreview({
    js: editors.jsEditor.getValue(),
    css: editors.cssEditor.getValue(),
    options: editors.optionsEditor.getValue()
  });
});

// init tabs
new JsTabs({ elm: '.left-section' }).init();
new JsTabs({ elm: '.right-section' }).init();
