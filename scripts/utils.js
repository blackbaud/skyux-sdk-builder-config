/* jshint node: true */
'use strict';

const spawn = require('cross-spawn');
const minimist = require('minimist');

function dirHasChanges(dir) {
  return exec('git', ['status', dir, '--porcelain'])
    .then((output) => {
      if (!output) {
        return false;
      }

      const result = output.trim();

      // Untracked files are prefixed with '??'
      // Modified files are prefixed with 'M'
      // https://git-scm.com/docs/git-status/1.8.1#_output
      // https://stackoverflow.com/a/6978402/6178885
      return (
        result.indexOf('??') === 0 ||
        result.indexOf('M') === 0
      );
    });
}

function exec(cmd, args, opts) {
  console.log('Spawning', cmd, args);

  const cp = spawn(cmd, args, opts);

  return new Promise((resolve, reject) => {
    let output;
    cp.stdout.on('data', (data) => {
      output = data.toString('utf8');
    });

    let error;
    cp.stderr.on('data', (data) => {
      error = data.toString('utf8');
    });

    cp.on('error', (err) => {
      console.log(`Error spawning`, cmd, err, output);
      reject(err);
    });

    cp.on('exit', (code) => {
      console.log(`Exiting`, cmd, code, output);
      if (code === 0) {
        resolve(output);
      } else {
        reject(error);
      }
    });
  });
}

function getBuildId() {
  const args = minimist(process.argv.slice(2));

  let buildId;

  switch (args.platform) {
    case 'travis':
      buildId = process.env.TRAVIS_BUILD_NUMBER;
      break;
    case 'vsts':
      buildId = process.env.BUILD_BUILDID;
      break;
    default:
      buildId = new Date().getTime();
      break;
  }

  return buildId;
}

module.exports = {
  dirHasChanges,
  exec,
  getBuildId
};
