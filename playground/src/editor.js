import debounce from 'lodash/debounce';
import defaultJsCode from './code/js';
import defaultCssCode from './code/css';
import defaultOptionsCode from './code/options';

monaco.editor.defineTheme('solarized-light', require('monaco-themes/themes/Eiffel'));

monaco.editor.setTheme('solarized-light');

const editorStyle = {
  fontSize: 14,
  lineHeight: 24,
  tabSize: 2
};
const minimap = { enabled: false };

let currentTab = 'js';

const jsEditor = monaco.editor.create(document.getElementById('editor-js'), {
  language: 'javascript',
  value: defaultJsCode,
  minimap,
  ...editorStyle
});
const cssEditor = monaco.editor.create(document.getElementById('editor-css'), {
  language: 'css',
  value: defaultCssCode,
  minimap,
  ...editorStyle
});
const optionsEditor = monaco.editor.create(document.getElementById('editor-options'), {
  language: 'json',
  value: defaultOptionsCode,
  minimap,
  ...editorStyle
});

document.querySelector('#editor-tabs .js-tabs__tabs-container').addEventListener('click', (e) => {
  const tab = e.target.getAttribute('data-tab');
  switch (tab) {
    case 'js':
      currentTab = 'js';
      break;
    case 'css':
      currentTab = 'css';
      break;
    case 'options':
      currentTab = 'options';
      break;
    default:
  }
  refreshActiveEditor();
});

function refreshActiveEditor() {
  setTimeout(() => {
    switch (currentTab) {
      case 'js':
        jsEditor.layout();
        break;
      case 'css':
        cssEditor.layout();
        break;
      case 'options':
        optionsEditor.layout();
        break;
      default:
    }
  });
}

window.addEventListener('resize', debounce(() => {
  refreshActiveEditor();
}, 10));

export default {
  jsEditor,
  cssEditor,
  optionsEditor
};
