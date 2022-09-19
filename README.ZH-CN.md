# babel-plugin-react-directives
一个给react (任何 JSX ) 提供一些类似 vue 指令的 Babel 转换插件。现在你可以在 [playground](https://peakchen90.github.io/babel-plugin-react-directives/) 上在线尝试。

[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/babel-plugin-react-directives/master.svg)](https://travis-ci.com/github/peakchen90/babel-plugin-react-directives)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/babel-plugin-react-directives.svg)](https://codecov.io/gh/peakchen90/babel-plugin-react-directives)
![node](https://img.shields.io/node/v/babel-plugin-react-directives.svg)
[![npm](https://img.shields.io/npm/v/babel-plugin-react-directives.svg)](https://www.npmjs.com/package/babel-plugin-react-directives)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/babel-plugin-react-directives/blob/master/LICENSE)

> [**English document**](./README.md)

## 目录
- [开始使用](#toc-usage)
  - [安装](#toc-installation)
  - [添加配置 .babelrc](#toc-configuring)
  - [插件options](#toc-plugin-options)
- [指令](#toc-directives)
  - [x-if](#toc-directives-x-if)
  - [x-else-if 和 x-else](#toc-directives-x-else-if-and-x-else)
  - [x-show](#toc-directives-x-show)
  - [x-for](#toc-directives-x-for)
  - [x-class](#toc-directives-x-class)
- [相关资源](#toc-related-packages)
- [已知问题](#toc-known-issues)
- [更新日志](#toc-changeloog)
- [许可证](#toc-license)

## <span id="toc-usage">开始使用</span>

需要 **node v10.0.0** 或者更高版本，**babel v7.0.0** 或者更高版本

### <span id="toc-installation">安装</span>
使用 npm:
```bash
npm install --save-dev babel-plugin-react-directives
npm install --save react-directives-runtime
```

使用 yarn:
```bash
yarn add --dev babel-plugin-react-directives
yarn add react-directives-runtime
```

### <span id="toc-configuring">添加配置 `.babelrc`</span>
```json
{
  "plugins": [
    "react-directives"
  ]
}
```

### <span id="toc-plugin-options">插件options</span>

```json
{
  "plugins": [
    [
      "react-directives",
      {
        "prefix": "x"
      }
    ]
  ]
}
```

- `prefix`: 指令的 props 前缀，默认值: "x"，用法示例: `x-if`

## <span id="toc-directives">指令</span>

### <span id="toc-directives-x-if">x-if</span>
如果 `x-if` 的值为**真值**，则将渲染此元素，否则不渲染。

**例子:**
```jsx harmony
const foo = <div x-if={true}>text</div>
```

**转换成:**
```jsx harmony
const foo = true ? <div>text</div> : null
```

### <span id="toc-directives-x-else-if-and-x-else">x-else-if 和 x-else</span>
在 `x-else-if` 的同一层级元素必须有相对应的 `x-if`，如果 `x-if` 的值是**假值**，并且 `x-else-if` 的值是**真值**，则它将被渲染。

在 `x-else` 的同一层级元素必须有相对应的 `x-if` 或 `x-else-if`，当 `x-if` 或者 `x-else-if` 都是**假值**时，它将被渲染。

**例子:**
```jsx harmony
const foo = (
  <div>
    <p x-if={data === 'a'}>A</p>
    <p x-else-if={data === 'b'}>B</p>
    <p x-else-if={data === 'c'}>C</p>
    <p x-else>D</p>
  </div>
)
```

**转换成:**
```jsx harmony
const foo = (
  <div>
    {data === 'a'
      ? <p>A</p>
      : data === 'b'
        ? <p>B</p>
        : data === 'c'
          ? <p>C</p>
          : <p>D</p>
    }
  </div>
)
```

### <span id="toc-directives-x-show">x-show</span>

`x-show` 通过 `style` prop 的 `display` 属性来控制元素的显示或隐藏，如果 `x-show` 的值是**假值**，则设置 `style.display = "none"`，否则不设置。

**例子:**
```jsx harmony
const foo = <div x-show={true}>text</div>
```

**转换成:**
```jsx harmony
const foo = (
  <div style={{
    display: true ? undefined : "none"
  }}>text
  </div>
)
```

当然，它也会通过调用 [mergeProps 方法](./runtime/merge-props.js) 合并其他 `style` props，例如：
```jsx harmony
const foo = (
  <div
    style={{ color: 'red' }}
    x-show={true}
    {...extraProps}>
    text
  </div>
)
```

将被转换成:
```jsx harmony
const foo = (
  <div
    {...extraProps}
    style={{
      ...mergeProps.call(this, "style", [
        { style: { color: 'red' } },
        extraProps
      ]),
      display: true ? undefined : "none"
    }}>text
  </div>
)
```

### <span id="toc-directives-x-for">x-for</span>
使用 `x-for` 遍历数组生成元素。

绑定的值应该像这样: `(item, index) in list`
- `list`: 遍历的目标数组
- `item`: 当前的值
- `index`: 当前的索引 (可选)

**提示**: 如果你在项目中使用了 [**ESLint**](https://eslint.org)，也许会提示你: `item` 和 `index` 是未定义的变量，请安装 [**eslint-plugin-react-directives**](https://github.com/peakchen90/eslint-plugin-react-directives) 来解决这个问题

**例子:**
```jsx harmony
const foo = (
  <ul>
    <li
      x-for={item in list}
      key={item.id}>{item.name}
    </li>
  </ul>
)
```

**转换成:**
```jsx harmony
const foo = (
  <ul>
    {list.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
)
```

另外请注意，如果与 `x-if` 一起使用，则 `x-for` 拥有更高的优先级，例如：
```jsx harmony
const foo = (
  <ul>
    <li
      x-for={item in list}
      x-if={item.name === 'alice'}
      key={item.id}>{item.name}
    </li>
  </ul>
)
```

将被转换成:
```jsx harmony
const foo = (
  <ul>
    {list.map(item => (
      item.name === 'alice'
        ? <li key={item.id}>{item.name}</li>
        : null
    ))}
  </ul>
)
```

### <span id="toc-directives-x-class">x-class</span>

`x-class` 通过 [classnames](https://github.com/JedWatson/classnames) 有条件的生成 className, 这对于动态生成 className 非常有用。
用法与 [classnames](https://github.com/JedWatson/classnames) 相同，绑定值将作为参数传给 [`classNames`](https://github.com/JedWatson/classnames#usage) 方法。

**例子:**
```jsx harmony
const foo = <div x-class={{ abc: true, def: false }}>
```

**转换成:**
```jsx harmony
const foo = <div className={classNames({ abc: true, def: false })}>
// className="abc"
```
**提示**: `classNames` 方法引用于 [runtime/classnames.js](./runtime/classnames.js).

当然，它也将合并其他的 `className` props, 例如:
```jsx harmony
const foo = <div x-class={{ abc: true, def: false }} className="xyz">
```

将被转换成:
```jsx harmony
const foo = <div className={classNames(["xyz", { abc: true, def: false }])}>
// className="xyz abc"
```

`x-class` 也可以与 [css-modules](https://github.com/css-modules/css-modules) 一起使用，例如：
```jsx harmony
import styles from './style.css';

const foo = (
  <div
    className={styles.foo}
    x-class={{
      [styles.bar]: true,
      [styles.qux]: false
    }}
  />
)
```

## <span id="toc-related-packages">相关资源</span>
- [eslint-plugin-react-directives](https://github.com/peakchen90/eslint-plugin-react-directives)


## <span id="toc-known-issues">已知问题</span>
- 在 Typescript 中使用 `x-for` 时，绑定的值 `item` 会报一个错误。临时的解决方案是，在使用前先声明变量 `item`，
  例如: `declare let item: any`. **不推荐在 Typescript 中使用 `x-for`**.


## <span id="toc-changeloog">更新日志</span>
查看更多信息: [CHANGELOG](./CHANGELOG.md)


## <span id="toc-license">许可证</span>
[MIT](./LICENSE)
