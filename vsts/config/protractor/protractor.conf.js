/*jshint jasmine: true, node: true */
'use strict';

const path = require('path');
const BrowserstackLocal = require('browserstack-local');
const minimist = require('minimist');
const common = require('@blackbaud/skyux-builder/config/protractor/protractor.conf');
const merge = require('@blackbaud/skyux-builder/utils/merge');
const pkg = require(path.join(process.cwd(), 'package.json'));

// Needed since we bypass Protractor cli
const args = minimist(process.argv.slice(2));

// This is what ties the tests to the local tunnel that's created
const id = 'skyux-spa-' + (new Date()).getTime();

// We rely on the builtin support of BrowserStack by setting browserstackUser/browserstackKey.
// If we didn't, java would still be considered a requirement.
const config = merge(common.config, {
  browserstackUser: args.bsUser,
  browserstackKey: args.bsKey,
  directConnect: false,
  capabilities: {
    name: pkg.name || id,
    os: 'Windows',
    os_version: '10',
    'browserstack.localIdentifier': id,
    'browserstack.local': true,
    'browserstack.networkLogs': true,
    'browserstack.debug': true
  },

  beforeLaunch: () => {
    require('ts-node').register({ ignore: false });
    return new Promise((resolve, reject) => {
      const bsConfig = {
        key: args.bsKey,
        onlyAutomate: true,
        forceLocal: true,
        force: true,
        localIdentifier: id,
        verbose: true
      };

      console.log('Attempting to connect to Browserstack.');
      exports.bsLocal = new BrowserstackLocal.Local();
      exports.bsLocal.start(bsConfig, (err) => {
        if (err) {
          console.error('Error connecting to Browserstack.');
          reject(err);
        } else {
          console.log('Connected to Browserstack.  Beginning e2e tests.')
          resolve();
        }
      });
    });
  },

  afterLaunch: () => {
    return new Promise((resolve, reject) => {
      if (exports.bsLocal) {
        console.log('Closing Browserstack connection.');
        exports.bsLocal.stop(resolve);
      } else {
        console.log('Not connected to Browserstack.  Nothing to close.');
        resolve();
      }
    });
  }
});

exports.config = config;
