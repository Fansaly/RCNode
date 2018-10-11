A third-party WEB APP for CNode of Chinese professional community of Node.js

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Browser Support
![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 11 ✓ |

- Foundation function
  - [x] CommonMark
  - [x] Markdown `checkbox` `tabel` `emoji`
  - [x] Markdown link target attr and `URL` replacement. e.g. `https://cnodejs.org` to `http://localhost:3000`
  - [x] Markdown syntax highlighting (Partially supported, view in [.babelrc](.babelrc) `prismjs` field.)
  - [x] Topic preview
  - [x] Topic `create` `update` `reply`
  - [x] Topic collect and reply +1
  - [x] Message remind
  - [x] adapt mobile device (great performance)

- Todos
  - [ ] Markdown image zoom
  - [ ] meta title
  - [ ] View - Message
  - [ ] page rerender when had invalid data of user or topic

- Optimization
  - [ ] Header animation `maybe`
  - [ ] Signout animation `maybe`
  - [ ] DrawerNav a link use react-router Link `maybe`
  - [ ] Material-UI Snackbar => notistack `maybe`

- Known issues
  - [ ] `@` `email` autolink in Markup
  - [ ] Edge browser scrolling failed to load topic
  - [ ] block router or page refresh when open editor

- Other
  - [ ] `componentWillReceiveProps` method replacement

### License
[MIT](https://opensource.org/licenses/MIT)
