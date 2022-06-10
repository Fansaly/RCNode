'use strict';

import fs from 'fs';
import path from 'path';
// import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

import chalk from 'chalk';
import semver from 'semver';
import semverUtils from 'semver-utils';
import ProgressBar from 'progress';

import utils from './utils.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const resolvePath = (dir) => path.join(__dirname, dir);

const convertor = (deps, state = 'upgrade') => {
  const data = {
    names: [],
    versions: [],
    latestVersions: [],
    colorVersions: [],
    args: [],
    colorArgs: [],
  };

  deps.forEach(({ name, version, latestVersion }) => {
    data.names.push(name);
    data.versions.push(version);

    if (state !== 'upgrade') return;

    const colorVersion = utils.colorizeDiff(version, latestVersion);
    data.latestVersions.push(latestVersion);
    data.colorVersions.push(colorVersion);
    data.args.push(`${name}@${latestVersion}`);
    data.colorArgs.push(`${chalk.white(name)}${chalk.gray('@')}${colorVersion}`);
  });

  return data;
};

const getTargetVersion = (version, info) => {
  const isRange = /\s+/.test(version);

  const avilabeVersion = Object.entries(info['dist-tags']).filter(([tag, ver]) => {
    const tags = ['next', 'beta'];
    const types = ['minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

    const condition = isRange
      ? semver.satisfies(ver, version)
      : semver.gt(ver, version) && types.includes(semver.diff(ver, version));

    if (tags.includes(tag) && condition) {
      return true;
    }
  });

  return avilabeVersion.length === 0 ? null : avilabeVersion[0][1];
};

const checkPackages = (deps = {}, options) => {
  const upgrade = [];
  const failed = [];
  const normal = [];

  let bar;
  const total = Object.keys(deps).length;

  if (total > 0) {
    bar = new ProgressBar('[:bar] :current/:total', {
      total,
      width: 40,
      complete: '#',
    });
    bar.render();
  }

  Object.entries(deps).forEach(([name, rangeVersion]) => {
    const info = options.manager.info(name, options.timeout);

    if (bar) bar.tick();

    rangeVersion = rangeVersion.replace(/\s+/g, ' ').trim();
    let item = { name, version: rangeVersion };

    if (!info || !info.version) {
      failed.push(item);
      return;
    }

    const operators = [];
    const versions = [];
    semverUtils
      .parseRange(rangeVersion)
      .filter((v) => !['||', '-'].includes(v.operator))
      .forEach(({ semver, operator }) => {
        operators.push(operator);
        versions.push(semver.replace(operator, ''));
      });

    let operator, version, latest;

    if (versions.length === 1) {
      operator = operators[0] || '';
      version = versions[0];

      if (semver.lt(version, info.version)) {
        latest = info.version;
      } else if (semver.neq(version, info.version)) {
        latest = getTargetVersion(version, info);
      }
    } else {
      operator = options.operator || '^';

      if (semver.satisfies(info.version, rangeVersion)) {
        latest = info.version;
      } else {
        latest = getTargetVersion(rangeVersion, info);
      }
    }

    if (latest) {
      upgrade.push({
        ...item,
        latest,
        operator,
        latestVersion: `${operator}${latest}`,
      });
    } else {
      normal.push(item);
    }
  });

  return { upgrade, failed, normal };
};

const checkUpdates = (packageJson, options) => {
  const { manager, depsEntries } = options;

  depsEntries.forEach((depsEntry) => {
    const deps = Object.assign({}, packageJson[depsEntry]);

    if (Object.keys(deps).length === 0) {
      return;
    }

    console.log(`\n${chalk.magentaBright(depsEntry)} checking of updates ...`);

    const result = checkPackages(deps, options);

    if (result.failed.length === 0 && result.upgrade.length === 0) {
      console.log(chalk.green(`Already up-to-date.`));
      return;
    }

    if (result.failed.length > 0) {
      const failed = convertor(result.failed, 'failed');
      console.log(`\n ${chalk.bgRed(' failed check of updates in below: ')}\n`);
      utils.printTable([failed.names, failed.versions], 'failed');
    }

    if (result.failed.length > 0 && result.upgrade.length > 0) {
      console.log(`\n ${chalk.gray('-----------------------------------------')}`);
    }

    if (result.upgrade.length > 0) {
      console.log();

      const upgrade = convertor(result.upgrade);
      utils.printTable([
        upgrade.names,
        upgrade.versions,
        upgrade.latestVersions,
        upgrade.colorVersions,
      ]);

      const colorArgs = manager.update(upgrade.colorArgs.join(' '), { color: true });
      console.log(`\n ${chalk.bgCyan(' upgrade manually: ')}\n ${colorArgs}`);
    }
  });
};

const start = async (options = {}) => {
  options = Object.assign({}, defaultOptions, options);
  const { priority } = options;

  const pkgManager = utils.initManagers(priority);
  if (!pkgManager.manager) {
    console.log(`${chalk.magentaBright(priority.join(', '))} not installed.`);
    process.exit(1);
  }

  const appPath = fs.realpathSync(process.cwd());
  const resolveApp = (dir) => path.resolve(appPath, dir);
  const paths = {
    appPath,
    appPackages: resolveApp('packages'),
    appPackageJson: resolveApp('package.json'),
    pnpmLockfile: resolveApp('pnpm-lock.yaml'),
    yarnLockfile: resolveApp('yarn.lock'),
    npmLockfile: resolveApp('package-lock.json'),
  };
  let data = {
    pnpm: fs.existsSync(paths.pnpmLockfile),
    yarn: fs.existsSync(paths.yarnLockfile),
    npm: fs.existsSync(paths.npmLockfile),
  };
  data = priority.reduce((acc, v) => ({ ...acc, [v]: data[v] }), {});
  const manager = utils.manager(data, pkgManager, priority);

  const homedir = utils.homedir();
  const rex = new RegExp(`^${homedir.dir.replace(/\\/g, '\\\\')}`, 'i');
  const packageJsonPath = paths.appPackageJson;
  const packageJsonPathAlias = packageJsonPath.replace(
    rex,
    chalk.cyanBright(homedir.alias),
  );

  console.log(`${chalk.blueBright('manager')} ${manager.name}`);
  console.log(`${chalk.blueBright('package')} ${packageJsonPathAlias}`);

  let packageJson = await readFile(new URL(packageJsonPath, import.meta.url));
  packageJson = JSON.parse(packageJson);
  checkUpdates(packageJson, { ...options, manager });
};

const defaultOptions = {
  depsEntries: ['dependencies', 'devDependencies'],
  priority: ['pnpm', 'yarn', 'npm'],
  // fetch package timeout
  timeout: 15 * 1e3,
  // default operator of comparator
  operator: '^',
};

start();
