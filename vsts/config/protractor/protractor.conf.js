/*jshint jasmine: true, node: true */
'use strict';

const BrowserstackLocal = require('browserstack-local');
const minimist = require('minimist');

const commonConfig = require('@blackbaud/skyux-builder/config/protractor/protractor.conf');
const merge = require('@blackbaud/skyux-builder/utils/merge');

// Needed since we bypass Protractor cli
const args = minimist(process.argv.slice(2));

let bsLocal;

const config = {

  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',

  capabilities: {
    'browserstack.user': args.bsUser,
    'browserstack.key': args.bsKey,
    'browserstack.local': true,
    browserName: 'chrome'
  },

  // Used to open the Browserstack connection
  beforeLaunch: () => {

    const bsConfig = {
      key: args.bsKey
    }

    bsLocal = new BrowserstackLocal.Local();
    bsLocal.start(bsConfig, (err) => {
      if (err) {
        return reject(err);
      }

      console.log('Connected to Browserstack.  Beginning e2e tests.')
      resolve();
    });
  },

  // Used to close the Browserstack connection
  afterLaunch: () => {
    return new Promise((resolve, reject) => {
      if (bsLocal) {
        console.log('Closing Browserstack connection.');
        return bsLocal.stop(resolve);
      }

      console.log('Not connected to Browserstack.  Nothing to close.');
      resolve();
    });
  }
}

exports.config = merge(commonConfig.config, config);