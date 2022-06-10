| code | expected | real |
| -------- | --- | ------ |
| `[/](/)` | `/` | [/](/) |
| `[/?](/?)` | `/?` | [/?](/?) |
| `[/?tab=all](/?tab=all)` | `/?tab=all` | [/?tab=all](/?tab=all) |
| `[/user](/user)` | `/user` | [/user](/user) |
| `[/user/t](/user/t)` | `/user/t` | [/user/t](/user/t) |

> `http(s)?://cnodejs.org/*` => `${location.origin}(/BASE_URL)?/*`

`https://cnodejs.org/user/test` [_domain_: `https://cnodejs.org/user/test`](https://cnodejs.org/user/test 'https://cnodejs.org/user/test')

`http://cnodejs.org` http://cnodejs.org

`http://cnodejs.org/` http://cnodejs.org/

`https://cnodejs.org/?tab=good` https://cnodejs.org/?tab=good

`https://cnodejs.org/?tab=good&page=1` https://cnodejs.org/?tab=good&page=1

`https://cnodejs.org/?md=true&tab=good` https://cnodejs.org/?md=true&tab=good

`https://cnodejs.org/?md=true&tab=good&page=1` https://cnodejs.org/?md=true&tab=good&page=1

`http://cnodejs.org/topic/a` http://cnodejs.org/topic/a

`http://cnodejs.org/topic/a#c` http://cnodejs.org/topic/a#c

`https://cnodejs.org/user/a` https://cnodejs.org/user/a

![cnodejs_logo](https://static2.cnodejs.org/public/images/cnodejs.svg 'CNode')

---

> keeped all `http(s)?://cnodejs.org/*`

`cnodejs.org` cnodejs.org

`https://cnodejs.org/api` [_domain_: `https://cnodejs.org/api`](https://cnodejs.org/api 'cnodejs.org/api')

`http://cnodejs.org/?tab=a` http://cnodejs.org/?tab=a

`https://cnodejs.org/topic/user?tab=good&page=1` https://cnodejs.org/topic/user?tab=good&page=1

`https://cnodejs.org/topic/user?md=true&tab=good` https://cnodejs.org/topic/user?md=true&tab=good

`https://cnodejs.org/topic/user?md=true&tab=good&page=1` https://cnodejs.org/topic/user?md=true&tab=good&page=1

`http://cnodejs.org/topic` http://cnodejs.org/topic

`http://cnodejs.org/topic/` http://cnodejs.org/topic/

`http://cnodejs.org/api` http://cnodejs.org/api

`https://cnodejs.org/api` https://cnodejs.org/api

`[cnodejs-api](https://cnodejs.org/api)` [cnodejs-api](https://cnodejs.org/api)