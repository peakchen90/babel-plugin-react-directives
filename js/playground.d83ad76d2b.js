/*! For license information please see playground.d83ad76d2b.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{21:function(e,r,_){},240:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var _runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(71),_style_playground_css__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(243),_style_playground_css__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_style_playground_css__WEBPACK_IMPORTED_MODULE_1__),_style_loading_css__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(21),_style_loading_css__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_style_loading_css__WEBPACK_IMPORTED_MODULE_2__),root=document.getElementById("app"),previewError=document.querySelector(".preview-render-error"),renderNull=function(){return null};function transformCode(e){return e=(e=(e=(e=Object(_runtime__WEBPACK_IMPORTED_MODULE_0__.a)(e)).replace(/export[\s\S]+default/g,"window.__App__ =")).replace(/module\.exports/g,"window.__App__")).replace(/export/g,"")}window.__render__=function render(code){window.__App__=renderNull,previewError.style.display="none";try{eval(transformCode(code)),ReactDOM.render(React.createElement(window.__App__),root)}catch(e){window.__catchError__(e)}},window.__catchError__=function(e){e&&(previewError.style.display="block",previewError.innerText="function"==typeof e.toString?e.toString():"Error: unknown exception"),console.error(e)},document.querySelector(".app-loading").style.display="none"},241:function(e,r){function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var o={}.hasOwnProperty;e.exports=function e(){for(var r=[],n=0;n<arguments.length;n++){var t=arguments[n];if(t){var c=_(t);if("string"===c||"number"===c)r.push(t);else if(Array.isArray(t)&&t.length){var a=e.apply(null,t);a&&r.push(a)}else if("object"===c)for(var i in t)o.call(t,i)&&t[i]&&r.push(i)}}return r.join(" ")}},242:function(e,r){function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}e.exports=function(e,r){for(var o,n=0;n<r.length;n++){var t=r[n];t&&"object"===_(t)&&e in t&&(o=t[e])}return o}},243:function(e,r,_){},71:function(e,r,_){"use strict";_.d(r,"a",(function(){return c}));var o={"classnames.js":_(241),"merge-props.js":_(242)},n="runtime__".concat(Math.random().toString(36).substr(2,10)),t=[];function c(e){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return t.forEach((function(_){e=r?e.replace(_.code,_.beautifyName):e.replace(_.code,_.realName)})),e}Object.keys(o).forEach((function(e){var r="".concat(n,"@").concat(e);window[r]=o[e],t.push({code:'require("babel-plugin-react-directives/runtime/'.concat(e,'")'),realName:"window['".concat(r,"']"),beautifyName:e.replace(/^([A-Za-z0-9]+)(?:-([A-Za-z0-9]+))?\.js$/,(function(e,r,_){return _?r+_.charAt(0).toUpperCase()+_.substr(1):r}))})}))}},[[240,0]]]);
//# sourceMappingURL=playground.d83ad76d2b.js.map