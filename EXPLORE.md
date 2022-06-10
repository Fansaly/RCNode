- 获取一个 UUID
  - macOS、linux
  ```sh
  uuidgen
  ```

  - Windows PowerShell
  ```ps1
  New-Guid
  ```

  - Online UUID Generator
  ```
  https://www.uuidgenerator.net/version4
  ```

- 获取一个头像
```
e.g. https://github.githubassets.com/pinned-octocat.svg
```

- 起个名字
```
e.g. M
```

- 打开控制台执行
```js
localStorage.setItem('RCN_AUTH', JSON.stringify({
  accesstoken: `${uuid}`,
  avatar: `${avatar}`,
  uname: `${name}`,
}));
```

这样，在不授权登录的情况下，体验大部分设计。