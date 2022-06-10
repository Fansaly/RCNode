```tsx
import React from 'react';

interface Props {
  text?: string;
  children?: Reac.ReactNode;
}

const App = ({ text, children }: Props) => {
  const handleClick = () => {
    console.log('it\'s ok.');
  };

  return (
    <div className="app" onClick={handleClick}>
      <span>{text}</span>
      <p>content</p>
      {children}
    </div>
  );
};

export default App;
```
```ts
interface AI {
  [key: string]: any;
}

const m: AI = {
  name: 'bot',
  features: ['bell', 'cook', 'sing', '...'],
};
```
```js
const { log: say } = console;
say('hi~');
```
```sh
function exec() {
  local command="$@";
  which command;
}
```
```text
nothing happended.
```
```
hi~ i am
```