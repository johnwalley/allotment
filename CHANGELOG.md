# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.8.0](https://github.com/johnwalley/allotment/compare/v1.7.0...v1.8.0) (2022-02-08)

### Features

- add onReset callback ([#154](https://github.com/johnwalley/allotment/issues/154)) ([904a8e6](https://github.com/johnwalley/allotment/commit/904a8e6acbf3692b4f2cb7fa102799872c70243d))
- add resize method to component instance ([#121](https://github.com/johnwalley/allotment/issues/121)) ([d25bd91](https://github.com/johnwalley/allotment/commit/d25bd91bde05c33bdebf586868a38a03056d8d57))
- add visible prop to Pane ([#137](https://github.com/johnwalley/allotment/issues/137)) ([3b0542c](https://github.com/johnwalley/allotment/commit/3b0542c24165c0cb054ee12a682c1b153a2de5ad))

### Bug Fixes

- **deps:** update dependency @svgr/webpack to v6.2.0 ([#135](https://github.com/johnwalley/allotment/issues/135)) ([40cbd8f](https://github.com/johnwalley/allotment/commit/40cbd8f0891b5fb63539a1df2ae43667868f87de))
- **deps:** update dependency @svgr/webpack to v6.2.1 ([#145](https://github.com/johnwalley/allotment/issues/145)) ([016d504](https://github.com/johnwalley/allotment/commit/016d504bcdcc505f705819c5ce349583700db185))

## [1.7.0](https://github.com/johnwalley/allotment/compare/v1.6.0...v1.7.0) (2022-01-22)

### Features

- separator color which works better on light and dark backgrounds ([a769262](https://github.com/johnwalley/allotment/commit/a769262de79658cda4866edbafe4ffb8e5f0773a))

### Bug Fixes

- call cancel hover after pointer up ([#129](https://github.com/johnwalley/allotment/issues/129)) ([b9a6e5f](https://github.com/johnwalley/allotment/commit/b9a6e5f10f89298e9935f14c9d52f63ec8527e2c))

### [1.6.0](https://github.com/johnwalley/allotment/compare/v1.5.2...v1.6.0) (2022-01-16)

### Bug Fixes

- allow changing order of panes ([cc38223](https://github.com/johnwalley/allotment/commit/cc38223e3f4315f61a50126630170c25ab8b5e1f))

### [1.5.2](https://github.com/johnwalley/allotment/compare/v1.5.1...v1.5.2) (2022-01-15)

This release was published without any updates and should be skipped.

### [1.5.1](https://github.com/johnwalley/allotment/compare/v1.5.0...v1.5.1) (2022-01-02)

### Bug Fixes

- set css custom variables if touch device detected ([2eb8c38](https://github.com/johnwalley/allotment/commit/2eb8c387009f013bd0440b83f4a41a53277c76ff))

## [1.5.0](https://github.com/johnwalley/allotment/compare/v1.4.2...v1.5.0) (2021-12-26)

### Features

- enable sash size to be customised in code ([#101](https://github.com/johnwalley/allotment/issues/101)) ([f177e48](https://github.com/johnwalley/allotment/commit/f177e48bdf4e12533b8e5dcdd76cd94802c83710))

### [1.4.2](https://github.com/johnwalley/allotment/compare/v1.4.1...v1.4.2) (2021-12-24)

### Bug Fixes

- replace remaining uses of sizes with defaultSizes ([cf5e2c1](https://github.com/johnwalley/allotment/commit/cf5e2c1dd77dd5a3edc4bd6f903acb824a90ed39))

### [1.4.1](https://github.com/johnwalley/allotment/compare/v1.4.0...v1.4.1) (2021-12-05)

### Bug Fixes

- defaultSizes needs to be used ([#77](https://github.com/johnwalley/allotment/issues/77)) ([cd2eae1](https://github.com/johnwalley/allotment/commit/cd2eae13116af91af00846e212452287cfb7c607))

## [1.4.0](https://github.com/johnwalley/allotment/compare/v1.3.0...v1.4.0) (2021-12-05)

### Features

- increase sash size on touch devices ([#66](https://github.com/johnwalley/allotment/issues/66)) ([20ab7d9](https://github.com/johnwalley/allotment/commit/20ab7d93ab836af864a67531b3c5c1244e23a3b8))

## [1.3.0](https://github.com/johnwalley/allotment/compare/v1.2.0...v1.3.0) (2021-12-03)

### Features

- add defaultSizes prop and deprecate sizes prop ([#72](https://github.com/johnwalley/allotment/issues/72)) ([2ece9ce](https://github.com/johnwalley/allotment/commit/2ece9ce2f8142d1c28b5394743d73f920f4489e2))
- add imperative reset method ([#69](https://github.com/johnwalley/allotment/issues/69)) ([aceb88f](https://github.com/johnwalley/allotment/commit/aceb88f2de9e454dfce2ccd35bc4e23c8d8e3cb7))

### Bug Fixes

- distribute space evenly when adding a pane ([#58](https://github.com/johnwalley/allotment/issues/58)) ([6feb767](https://github.com/johnwalley/allotment/commit/6feb767cb8a289f5c167ae981b435e4c02f50215))

## [1.2.0](https://github.com/johnwalley/allotment/compare/v1.1.0...v1.2.0) (2021-10-03)

### Features

- support setting initial sizes ([#14](https://github.com/johnwalley/allotment/issues/14)) ([b07415e](https://github.com/johnwalley/allotment/commit/b07415e0539ca28f123a143c88aa28de7ec80b75))

## [1.1.0](https://github.com/johnwalley/allotment/compare/v1.0.1...v1.1.0) (2021-09-30)

### Features

- set props on children ([#9](https://github.com/johnwalley/allotment/issues/9)) ([180ed52](https://github.com/johnwalley/allotment/commit/180ed52bced6d74860142092f27800728896d97e))

### Bug Fixes

- center sash ([#12](https://github.com/johnwalley/allotment/issues/12)) ([d2b7486](https://github.com/johnwalley/allotment/commit/d2b74867dae30ae05f3f20f4d4a29cc8ebc7a9e7))

### [1.0.1](https://github.com/johnwalley/allotment/compare/v1.0.0...v1.0.1) (2021-09-24)

### Bug Fixes

- remove requirement to use Allotment.Pane if using refs with children ([93a30bb](https://github.com/johnwalley/allotment/commit/93a30bb58c9d12b1a3b4a441f57613aea79e7923))

## 1.0.0 (2021-09-23)

### Features

- basic functionality ([#1](https://github.com/johnwalley/allotment/issues/1)) ([36b4442](https://github.com/johnwalley/allotment/commit/36b44425f9ea8d6d18e2e74cabfbc9813c52c0fd))
