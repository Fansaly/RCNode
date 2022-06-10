'use strict';

import childProcess from 'child_process';
import chalk from 'chalk';
import os from 'os';

const homedir = () => {
  const dir = os.homedir();
  const alias = os.platform() === 'win32' ? '%UserProfile%' : '~';

  return { dir, alias };
};

const spawnSync = (cmd, args = [], options = {}) => {
  let result, stdout;

  try {
    result = childProcess.spawnSync(cmd, args, options);
    stdout = result.stdout.toString('utf8').trim();
  } catch (e) {
    // Swallow the exceptions.
  }

  return stdout;
};

const initManagers = (priority) => {
  let tools = {
    pnpm: {
      info: {
        command: 'info',
        flag: '--json',
        data: 'null',
      },
      update: 'update',
    },
    yarn: {
      info: {
        command: 'info',
        flag: '--json',
        data: '{ "data": null }',
        key: 'data',
      },
      update: 'upgrade',
    },
    npm: {
      info: {
        command: 'view',
        flag: '--json',
        data: 'null',
      },
      update: 'update',
    },
  };

  const installed = [];
  const managers = Object.entries(tools).reduce((acc, [name, { info, update }]) => {
    const version = spawnSync(name, ['-v']);
    const tool = {
      name,
      version,
      installed: !!version,
      info: function (name, timeout) {
        const args = [info.command, name, info.flag];
        const stdout = spawnSync(this.name, args, { timeout }) || info.data;

        let result;
        try {
          result = JSON.parse(stdout);
        } catch (e) {
          // Swallow the exceptions.
        }

        if (!result || typeof result !== 'object') {
          return;
        }

        if (info.key) {
          result = result[info.key];
        }

        return result;
      },
      update: function (pkg, { color } = {}) {
        let cmd = `${this.name} ${update}`;
        if (color) cmd = chalk.cyan(cmd);
        return `${cmd} ${pkg}`;
      },
    };

    if (version) {
      installed.push(name);
    }

    return { ...acc, [name]: tool };
  }, {});

  let manager;
  for (let name of priority) {
    if (installed.includes(name)) {
      manager = managers[name];
    }

    if (manager) break;
  }

  return { managers, manager, installed };
};

const manager = (data = {}, pkgManager, priority) => {
  pkgManager = pkgManager || initManagers(priority);

  let result = pkgManager.manager;
  for (let name in data) {
    if (!pkgManager.installed.includes(name)) {
      continue;
    }

    if (data[name]) {
      result = pkgManager.managers[name];
      break;
    }
  }

  return result;
};

const colorizeDiff = (curr, latest) => {
  let leadingWildcard = '';

  // separate out leading ^ or ~
  if (/^[~^]/.test(latest) && latest[0] === curr[0]) {
    leadingWildcard = latest[0];
    latest = latest.slice(1);
    curr = curr.slice(1);
  }

  // split into parts
  const partsToColor = latest.split('.');
  const partsToCompare = curr.split('.');

  let i = partsToColor.findIndex((part, i) => part !== partsToCompare[i]);
  i = i >= 0 ? i : partsToColor.length;

  // major = red (or any change before 1.0.0)
  // minor = cyan
  // patch = green
  const color = i === 0 || partsToColor[0] === '0' ? 'red' : i === 1 ? 'cyan' : 'green';

  // if we are colorizing only part of the word, add a dot in the middle
  const middot = i > 0 && i < partsToColor.length ? '.' : '';

  return (
    leadingWildcard +
    partsToColor.slice(0, i).join('.') +
    middot +
    chalk[color](partsToColor.slice(i).join('.'))
  );
};

const pad = (str, len, char, align) => {
  if (str.length > len) {
    const chr = '…';
    return str.substr(0, len - chr.length) + chr;
  }

  switch (align) {
    case 'middle': {
      const padlen = len - str.length;
      const right = Math.ceil(padlen / 2);
      const left = padlen - right;
      str = Array(left + 1).join(char) + str + Array(right + 1).join(char);
      break;
    }
    case 'right': {
      str = Array(len + 1 - str.length).join(char) + str;
      break;
    }
    default: {
      str = str + Array(len + 1 - str.length).join(char);
    }
  }

  return str;
};

const maxLength = (strs = []) => {
  let len = 0;

  strs.forEach((str) => {
    len = Math.max(len, str.length);
  });

  return len;
};

const printTable = (
  [item1 = [], item2 = [], item3 = [], item4 = []] = [],
  state = 'upgrade',
) => {
  if (item1.length === 0) return;

  const lenItem1 = maxLength(item1);
  const lenItem2 = maxLength(item2);
  const lenItem3 = maxLength(item3);

  item1.forEach((column1, index) => {
    const column2 = item2[index];
    const paded1 = pad(column1, lenItem1, ' ', 'left');
    const paded2 = pad(column2, lenItem2, ' ', 'right');

    let str = ` ${paded1}  ${paded2}`;

    if (state === 'upgrade') {
      const column3 = item3[index];
      const column4 = item4[index];
      const paded3 = pad(column3, lenItem3, ' ', 'right').replace(column3, column4);
      str = `${str}  →  ${paded3}`;
    }

    console.log(str);
  });
};

export default {
  homedir,
  spawnSync,
  initManagers,
  manager,
  colorizeDiff,
  printTable,
  maxLength,
  pad,
};
