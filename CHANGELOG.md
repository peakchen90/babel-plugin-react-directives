# CHANGELOG

## v1.1.0
2019-11-30

- Feature: Added `x-class` directive for conditionally joining classNames together.
- Optimization: Split the runtime into multiple independent files to reduce runtime bundle size.

## v1.0.2
2019-11-23

- Bug: fix bug that when `x-if` is nested under `x-else` and `x-else-if`, an error is reported.

## v1.0.0
2019-10-20

- Feature: Added `x-model-hook` directive for **useState hook function**, and the `x-model` can only be used in **class component** now
- Optimization: In some cases use the runtime instead of the AST code
- Optimization: Fix some problem of `x-model`
- Optimization: Improved stability

## v0.1.1
2019-10-17

- Optimization: Update some documents


## v0.1.0
2019-10-07

- Feature: Support for `x-if` and `x-else-if` and `x-else`
- Feature: Support for `x-show`
- Feature: Support for `x-for`
- Feature: Support for `x-model`
