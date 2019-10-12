# babel-plugin-react-directives
A babel plugin that provides some directives for react(any JSX), similar to directive of vue.


[![Travis (.org) branch](https://img.shields.io/travis/peakchen90/babel-plugin-react-directives/master.svg)](https://travis-ci.org/peakchen90/babel-plugin-react-directives)
[![Codecov](https://img.shields.io/codecov/c/github/peakchen90/babel-plugin-react-directives.svg)](https://codecov.io/gh/peakchen90/babel-plugin-react-directives)
![node](https://img.shields.io/node/v/babel-plugin-react-directives.svg)
[![npm](https://img.shields.io/npm/v/babel-plugin-react-directives.svg)](https://www.npmjs.com/package/babel-plugin-react-directives)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peakchen90/babel-plugin-react-directives/blob/master/LICENSE)

> [**中文文档**](./README.ZH-CN.md)

## Usage

Requires **node v8.6.0** or higher, **babel v6.20.0** or higher.

### Installation
use npm:
```bash
npm install --save-dev babel-plugin-react-directives
```

use yarn:
```base
yarn add --dev babel-plugin-react-directives
```

### Configuring via `.babelrc`
```json
{
  "plugins": [
    "react-directives"
  ]
}
```

### options

default options:
```json5
{
  "prefix": "x",
  "pragmaType": "React"
}
```

- `prefix`: JSX props prefix for directive, default: `"x"`, usage example: `x-if`
- `pragmaType`: Help internal to correctly identify some syntax, such as hooks, default: `"React"`

## Directives

### x-if
If the `x-if` value is **truthy**, this element will be rendered, otherwise do not.

**Example:**
```jsx harmony
const foo = <div x-if={true}>text</div>
```

**Converted to:**
```jsx harmony
const foo = true ? <div>text</div> : null
```

### x-else-if and x-else
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

**Converted to:**
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

### x-show
The `x-show` controls the display or hiding of elements by the `display` of the `style` prop. If the `x-show` value is **falsy**, will set `style.display = "none"`, otherwise do nothing.


**Example:**
```jsx harmony
const foo = <div x-show={true}>text</div>
```

**Converted to:**
```jsx harmony
const foo = (
  <div style={{
    display: true ? undefined : "none"
  }}>text
  </div>
)
```

Of course, it will also merge other `style`, for example:
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
      ...{ color: 'red' },
      ...(extraProps && extraProps.style),
      display: true ? undefined : "none"
  }}>text
  </div>
)
```

### x-for
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

**Converted to:**
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

### x-model
The `x-model` is a syntax sugar similar to vue `v-model`, which binds a state to the `value` prop of the form element and automatically updates the state when the element is updated.

**Example:**
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: 'text' }
  }
  
  render() {
    return <input x-model={this.state.data}/>
  }
}
```

**Converted to:**
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'text'
    };
  }

  render() {
    return (
      <input
        value={this.state.data}
        onChange={(..._args) => {
          let _value = _args[0] && _args[0].target && typeof _args[0].target === "object"
            ? _args[0].target.value
            : _args[0];

          this.setState(_prevState => {
            return { data: _value };
          });
        }}
      />
    );
  }
}
```

When there are other `onChange` props, merge them:
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: 'text' }
  }
  
  onChange(e) {
    console.log(e.target.value);
  }
  
  render() {
    return (
      <input
        onChange={this.onChange.bind(this)}
        x-model={this.state.data}
        {...this.props}
      />
    ) 
  }
}
```

will be converted to:
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: 'text' };
  }

  onChange(e) {
    console.log(e.target.value);
  }

  render() {
    return (
      <input
        {...this.props}
        value={this.state.data}
        onChange={(..._args) => {
          let _value = _args[0] && _args[0].target && typeof _args[0].target === "object" 
            ? _args[0].target.value 
            : _args[0];

          this.setState(_prevState => {
            return { data: _value };
          });

          let _extraFn = {
            ...{ onChange: this.onChange.bind(this) },
            ...(this.props && this.props.onChange)
          }.onChange;
          typeof _extraFn === "function" && _extraFn.apply(this, _args);
        }}
      />
    );
  }
}
```

If the `x-model` value is an object's property, a new object is created when it is updated, and the object's old property values are merged. For example:
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        text: 'bar'
      }
    }
  }

  render() {
    const { data } = this.state;
    return <input x-model={data.text}/>
  }
}
```

will be converted to:
```jsx harmony
class Foo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { text: 'bar' }
    };
  }

  render() {
    const { data } = this.state;
    return (
      <input 
        value={data.text} 
        onChange={(..._args) => {
          let _value = _args[0] && _args[0].target && typeof _args[0].target === "object" 
            ? _args[0].target.value 
            : _args[0];
  
          this.setState(_prevState => {
            let _val = {
              ..._prevState.data,
              text: _value
            };
            return {
              data: _val
            };
          });
      }}/>
    );
  }
}
```

Of course you can also use **`useState`** hook

**Note**: If you use [**ESLint**](https://eslint.org), you may receive an error that `setState` is defined but never used.
Please install [**eslint-plugin-react-directives**](https://github.com/peakchen90/eslint-plugin-react-directives) plugin to solve it.

```jsx harmony
function Foo() {
  const [data, setData] = useState(0);
  return <input x-model={data}/>
}
```

will be converted to:
```jsx harmony
function Foo() {
  const [data, setData] = useState(0);
  return (
    <input
      value={data}
      onChange={(..._args) => {
        let _value = _args[0] && _args[0].target && typeof _args[0].target === "object" 
          ? _args[0].target.value 
          : _args[0];
  
        setData(_value);
    }} />
  );
}
```


## Related Packages
- [eslint-plugin-react-directives](https://github.com/peakchen90/eslint-plugin-react-directives)

## CHANGELOG

See more information at: [CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
