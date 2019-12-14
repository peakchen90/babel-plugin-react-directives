const runtimeMap = {
  'classnames.js': require('../../runtime/classnames'),
  'invoke-onchange.js': require('../../runtime/invoke-onchange'),
  'merge-props.js': require('../../runtime/merge-props'),
  'resolve-value.js': require('../../runtime/resolve-value')
};

const runtimeBase = `runtime__${Math.random().toString(36).substr(2, 10)}`;
const runtimeResolver = [];

Object.keys(runtimeMap).forEach((name) => {
  const runtimeNames = `${runtimeBase}@${name}`;
  window[runtimeNames] = runtimeMap[name];
  runtimeResolver.push({
    code: `require("babel-plugin-react-directives/runtime/${name}")`,
    resolve: `window.top['${runtimeNames}']`
  });
});

export default runtimeResolver;
