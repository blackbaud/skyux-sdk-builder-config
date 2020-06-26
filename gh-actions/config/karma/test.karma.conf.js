const shared = require('../../../shared/karma/shared.karma.conf');

/**
 * GitHub Actions platform overrides.
 * @name getConfig
 * @param {Object} config
 */
function getConfig(config) {
  config.set({
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000
  });

  shared(config, {
    BROWSER_STACK_USERNAME: process.env.BROWSER_STACK_USERNAME,
    BROWSER_STACK_ACCESS_KEY: process.env.BROWSER_STACK_ACCESS_KEY,
    BROWSER_STACK_BUILD_ID: process.env.BROWSER_STACK_BUILD_ID,
    BROWSER_STACK_PROJECT: process.env.BROWSER_STACK_PROJECT
  });
}

module.exports = getConfig;
