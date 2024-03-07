<!-- markdownlint-disable MD033 -->
<h1 align="center">Tombo</h1>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="React Native is released under the MIT license." />
  <img src="https://github.com/wataru-maeda/react-native-boilerplate/actions/workflows/preview.yml/badge.svg" alt="" />
  <img src="https://github.com/wataru-maeda/react-native-boilerplate/actions/workflows/test.yml/badge.svg" alt="" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
</p>

## 🗒️ Requirements

- [Node: 20.x](https://nodejs.org/en)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)

## 🚀 Quick Start

1. Download zip or click "Use this template"
1. Install packages with `npm install` or `yarn install`
1. Spin up dev environment with `npm run start` or `yarn run start`

## Project structure

```txt
tombo/src
│
├── components    # Reusable components
│
├── navigator
│   │
│   ├── drawer    # The app sidebar is the 'drawer'
│   │
│   ├── tab       # Where the bottom tab navigation buttons are defined.
│   │             # Each tab have a 'stack' of different screens it can support.
│   │
│   └── stack     # Here is where the screens stacks are defined for each tab.
│                 # We currently have three tabs: Home, Search, and Profile.
│
├── states        # The different *reactive* states of the app are defined here,
│   │             # along with the actions that can be performed on them.
│   │             # This mix of state and actions is called a 'slice'.
│   │
│   └── app        # The global app state. We store user's status here.
│
├── utils          # Different utilities and helpers
│   │
│   └ store.ts     # Where the different slices are 'registered' to Redux.
│
└── views          # The different screens of the app.
```


## 🥇 Libraries

- [expo v50](https://docs.expo.dev/versions/v50.0.0)
- [expo-asset](https://docs.expo.dev/versions/latest/sdk/asset/)
- [expo-font](https://docs.expo.dev/versions/latest/sdk/font/)
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [expo-splash-screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/)
- [react-navigation 6.x](https://github.com/react-navigation/react-navigation)
- [redux-toolkit](https://redux-toolkit.js.org/)

## 🥈 Libraries for development

- [eslint](https://github.com/eslint/eslint)
- [prettier](https://github.com/prettier/prettier)
- [jest](https://jestjs.io/)
- [lint-staged](https://github.com/okonet/lint-staged)

## ☀️ Icons

Expo provides a popular set of vector icons. Please search icons from [here](https://icons.expo.fyi/)

## 📓 Licence

This project is available under the MIT license. See the [LICENSE](https://github.com/wataru-maeda/react-native-boilerplate/blob/main/LICENSE) file for more info.
