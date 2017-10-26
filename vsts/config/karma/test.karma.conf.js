/*jshint node: true*/
'use strict';

/**
 * VSTS platform overrides.
 * @name getConfig
 * @param {Object} config
 */
function getConfig(config) {
  config.set({
      custom: true
  });
}

module.exports = getConfig;
