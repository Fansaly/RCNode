A third-party WEB APP for CNode of Chinese professional community of Node.js

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Browser Support
![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 11 ✓ |

- Foundation function
  - [x] CommonMark
  - [x] MD checkbox
  - [x] MD tabel
  - [x] MD emoji
  - [x] MD link target attr
  - [x] MD link `URL` replacement. e.g. `https://cnodejs.org` to `http://localhost:3000`
  - [x] MD syntax highlighting (Partially supported, view in [.babelrc](.babelrc) file `prismjs` field.)
  - [ ] MD image zoom
  - [x] Topic preview
  - [x] Topic `create` `update` `reply` function
  - [x] Topic collect
  - [x] Topic reply +1
  - [x] Message remind
  - [ ] View - Message
  - [ ] meta title
  - [ ] management collected topics
  - [ ] page rerender when had invalid data of user or topic

- Optimization
  - [ ] adapt mobile device
    - [ ] Component - TopiCard
    - [ ] View - Message
  - [ ] Layout - Header - DrawerNav -> a link use react-router Link `maybe`
  - [ ] Component - Header -> animation `maybe`
  - [ ] Component - Me -> signout animation `maybe`
  - [ ] Material-UI Snackbar => notistack `maybe`
  - [ ] manifest icons and favicon.ico

- Known issues
  - [ ] block router or page refresh when open editor
  - [ ] [SpeeDialAction propTypes warnings](https://github.com/mui-org/material-ui/issues/12159)
  - [ ] Edge load topic-list faild

- Other
  - [ ] `componentWillReceiveProps` method replacement

### License
[MIT](https://opensource.org/licenses/MIT)
