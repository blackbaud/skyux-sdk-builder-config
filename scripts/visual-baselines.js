/* jshint node: true */
'use strict';

const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const logger = require('@blackbaud/skyux-logger');

const {
  exec,
  dirHasChanges,
  getBuildId
} = require('./utils');

const baselineScreenshotsDir = 'screenshots-baseline';
const tempDir = '.skypagesvisualbaselinetemp';

function handleBaselineScreenshots() {
  const branch = 'master';
  const opts = { cwd: tempDir };
  const gitUrl = process.env.VISUAL_BASELINES_REPO_URL;
  const buildId = getBuildId();

  return Promise.resolve()
    .then(() => exec('git', ['config', '--global', 'user.email', '"sky-build-user@blackbaud.com"']))
    .then(() => exec('git', ['config', '--global', 'user.name', '"Blackbaud Sky Build User"']))
    .then(() => exec('git', ['clone', gitUrl, '--single-branch', tempDir]))
    .then(() => fs.copy(
      baselineScreenshotsDir,
      path.resolve(tempDir, baselineScreenshotsDir)
    ))
    .then(() => exec('git', ['checkout', branch], opts))
    .then(() => exec('git', ['status'], opts))
    .then(() => exec('git', ['add', baselineScreenshotsDir], opts))
    .then(() => exec('git', [
      'commit', '-m', `Build #${buildId}: Added new baseline screenshots. [ci skip]`
    ], opts))
    .then(() => exec('git', ['push', '-fq', 'origin', branch], opts))
    .then(() => {
      logger.info('New baseline images saved.');
    });
}

function checkScreenshots() {
  // Don't commit new visual baseline images during a pull request.
  if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
    logger.info('New visual baseline images are not saved during a pull request. Aborting script.');
    return Promise.resolve();
  }

  logger.info('Checking new visual baseline images...');

  return Promise.resolve()
    .then(() => dirHasChanges(baselineScreenshotsDir))
    .then((hasChanges) => {
      if (hasChanges) {
        logger.info('New baseline images detected.');
        return handleBaselineScreenshots();
      }

      logger.info('No new baseline images detected. Done.');
    });
}

checkScreenshots()
  .then(() => {
    rimraf.sync(tempDir);
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);
    rimraf.sync(tempDir);
    process.exit(1);
  });
