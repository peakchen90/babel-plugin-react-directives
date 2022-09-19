# babel-plugin-react-directives
A babel plugin that provides some directives for react(any JSX), similar to directives of vue. And you can now try it online at [playground](https://peakchen90.github.io/babel-plugin-react-directives/).

[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/babel-plugin-react-directives/master.svg)](https://travis-ci.com/github/peakchen90/babel-plugin-react-directives)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/babel-plugin-react-directives.svg)](https://codecov.io/gh/peakchen90/babel-plugin-react-directives)
![node](https://img.shields.io/node/v/babel-plugin-react-directives.svg)
[![npm](https://img.shields.io/npm/v/babel-plugin-react-directives.svg)](https://www.npmjs.com/package/babel-plugin-react-directives)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/babel-plugin-react-directives/blob/master/LICENSE)

> [**中文文档**](./README.ZH-CN.md)

## Table of Contents
- [Usage](#toc-usage)
  - [Installation](#toc-installation)
  - [Configuring via .babelrc](#toc-configuring)
  - [Plugin options](#toc-plugin-options)
- [Directives](#toc-directives)
  - [x-if](#toc-directives-x-if)
  - [x-else-if and x-else](#toc-directives-x-else-if-and-x-else)
  - [x-show](#toc-directives-x-show)
  - [x-for](#toc-directives-x-for)
  - [x-class](#toc-directives-x-class)
- [Related Packages](#toc-related-packages)
- [Known Issues](#toc-known-issues)
- [CHANGELOG](#toc-changeloog)
- [LICENSE](#toc-license)

## <span id="toc-usage">Usage</span>

Requires **node v10.0.0** or higher, **babel v7.0.0** or higher.

### <span id="toc-installation">Installation</span>
use npm:
```bash
npm install --save-dev babel-plugin-react-directives
npm install --save react-directives-runtime
```

use yarn:
```base
yarn add --dev babel-plugin-react-directives
yarn add react-directives-runtime
```

### <span id="toc-configuring">Configuring via `.babelrc`</span>
```json
{
  "plugins": [
    "react-directives"
  ]
}
```

### <span id="toc-plugin-options">Plugin options</span>

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

- `prefix`: JSX props prefix for directives. Default: "x", example usage: `x-if`
## <span id="toc-directives">Directives</span>

### <span id="toc-directives-x-if">x-if</span>
If the `x-if` value is **truthy**, this element will be rendered, otherwise do not.

**Example:**
```jsx harmony
const foo = <div x-if={true}>text</div>
```

**Convert to:**
```jsx harmony
const foo = true ? <div>text</div> : null
```

### <span id="toc-directives-x-else-if-and-x-else">x-else-if and x-else</span>
The `x-else-if` must have a corresponding `x-if`. if `x-if` value is **falsy**, and `x-else-if` value is **truthy**, it will be rendered.

The `x-else` must have the corresponding `x-if` or `x-if-else`. When all corresponding `x-if` or `x-else-if` value are **falsy**, it will be rendered.

**Example:**
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

**Convert to:**
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
The `x-show` controls the display or hiding of elements through the `display` of the `style` prop. If the `x-show` value is **falsy**, will set `style.display = "none"`, otherwise do nothing.


**Example:**
```jsx harmony
const foo = <div x-show={true}>text</div>
```

**Convert to:**
```jsx harmony
const foo = (
  <div style={{
    display: true ? undefined : "none"
  }}>text
  </div>
)
```

Of course, it will also merge other `style` props by calling the [mergeProps method](./runtime/merge-props.js), for example:
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

will be converted to:
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
The `x-for` is used to traverse arrays to generate elements.

The value should like: `(item, index) in list`
- `list`: array for traversal
- `item`: current  value
- `index`: current  index (optional)

**Note**: If you use [**ESLint**](https://eslint.org), you may receive an error that `item` and `index` are undeclared variables.
Please install [**eslint-plugin-react-directives**](https://github.com/peakchen90/eslint-plugin-react-directives) plugin to solve it.


**Example:**
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

**Convert to:**
```jsx harmony
const foo = (
  <ul>
    {list.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
)
```

Also note that if used with `x-if`, the `x-for` has a higher priority, for example:
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

will be converted to:
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

The `x-class` for conditionally joining classNames together by [classnames](https://github.com/JedWatson/classnames), and it is useful for dynamically generating className.
Usage is the same as [classnames](https://github.com/JedWatson/classnames), the binding value will be passed as a parameter to the [`classNames`](https://github.com/JedWatson/classnames#usage) method.

**Example:**
```jsx harmony
const foo = <div x-class={{ abc: true, def: false }}>
```

**Convert to:**
```jsx harmony
const foo = <div className={classNames({ abc: true, def: false })}>
// className="abc"
```
**Note**: `classNames` method references [runtime/classnames.js](./runtime/classnames.js).

Of course, it will also merge other `className` props, for example:
```jsx harmony
const foo = <div x-class={{ abc: true, def: false }} className="xyz">
```

will be converted to:
```jsx harmony
const foo = <div className={classNames(["xyz", { abc: true, def: false }])}>
// className="xyz abc"
```

The `x-class` can also be used with [css-modules](https://github.com/css-modules/css-modules), the usage is as follows:
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

## <span id="toc-related-packages">Related Packages</span>
- [eslint-plugin-react-directives](https://github.com/peakchen90/eslint-plugin-react-directives)


## <span id="toc-known-issues">Known Issues</span>
- When using `x-for` in Typescript, the binding value `item` will report an error. The temporary solution is to declare the `item` variable before use.
  Such as `declare let item: any`. **And it is not recommended to use `x-for` in Typescript**.


## <span id="toc-changeloog">CHANGELOG</span>
See more information at: [CHANGELOG](./CHANGELOG.md)


## <span id="toc-license">LICENSE</span>
[MIT](./LICENSE)
