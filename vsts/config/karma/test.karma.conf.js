/*jshint node: true*/
'use strict';

// Reading credentials from command line
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

/**
 * VSTS platform overrides.
 * @name getConfig
 * @param {Object} config
 */
function getConfig(config) {

  // Apply defaults
  require('@blackbaud/skyux-builder/config/karma/shared.karma.conf')(config);

  let customLaunchers = {
    bs_windows_chrome_latest: {
      base: 'BrowserStack',
      browser: 'chrome',
      os: 'Windows',
      os_version: '8.1'
    }
  };

  config.set({

    // Related to publishing code coverage
    coverageReporter: {
      reporters: [
        { 
          type: 'cobertura' 
        }
      ]
    },

    // Related to publishing test results
    reporters: [
      'junit'
    ],

    // Related to browserstack
    browsers: Object.keys(customLaunchers),
    customLaunchers: customLaunchers,
    browserDisconnectTimeout: 3e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 3e5,
    captureTimeout: 3e5,
    browserStack: {
      port: 9876,
      pollingTimeout: 10000,
      username: args.bsUser,
      accessKey: args.bsKey
    }
  });
}

module.exports = getConfig;