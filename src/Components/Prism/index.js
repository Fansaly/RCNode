import Prism from 'prismjs';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-erlang';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-objectivec';

/**
 * https://github.com/PrismJS/prism/issues/1423
 * Cannot read property 'tokenizePlaceholders' of undefined
 */
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';

import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';

export default Prism;

export { default as lightPrismTheme } from 'prismjs/themes/prism.css';
export { default as darkPrismTheme } from 'prismjs/themes/prism-okaidia.css';

// alias => prism
export const alias = {
  'h': 'c',
  'rb': 'ruby',
  'py': 'python',
  'sh': 'bash',
  'yml': 'yaml',
  'golang': 'go',
  'dockerfile': 'docker',
  'tex': 'latex',
  'bat': 'batch',
  'ps1': 'powershell',
  'psm1': 'powershell',
};

const styleNode = document.querySelector('#prismjs');

export const setPrismTheme = theme => {
  styleNode.textContent = theme;
};
