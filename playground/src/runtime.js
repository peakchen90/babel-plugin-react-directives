const runtimeMap = {
  'classnames.js': require('../../runtime/classnames'),
  'merge-props.js': require('../../runtime/merge-props'),
};

const runtimeBase = `runtime__${Math.random().toString(36).substr(2, 10)}`;
const runtimeResolver = [];

Object.keys(runtimeMap).forEach((name) => {
  const runtimeNames = `${runtimeBase}@${name}`;
  window[runtimeNames] = runtimeMap[name];
  runtimeResolver.push({
    code: `require("babel-plugin-react-directives/runtime/${name}")`,
    realName: `window['${runtimeNames}']`,
    beautifyName: name.replace(/^([A-Za-z0-9]+)(?:-([A-Za-z0-9]+))?\.js$/, (match, $1, $2) => {
      if (!$2) return $1;
      return $1 + $2.charAt(0).toUpperCase() + $2.substr(1);
    })
  });
});

export function transformRuntime(code, beautify = false) {
  runtimeResolver.forEach((item) => {
    if (beautify) {
      code = code.replace(item.code, item.beautifyName);
    } else {
      code = code.replace(item.code, item.realName);
    }
  });
  return code;
}
