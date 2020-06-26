const getConfig = require('../../../shared/protractor/shared.protractor.conf');

const config = getConfig({
  BROWSER_STACK_USERNAME: process.env.BROWSER_STACK_USERNAME,
  BROWSER_STACK_ACCESS_KEY: process.env.BROWSER_STACK_ACCESS_KEY,
  BROWSER_STACK_BUILD_ID: process.env.BROWSER_STACK_BUILD_ID,
  BROWSER_STACK_PROJECT: process.env.BROWSER_STACK_PROJECT
});

exports.config = config;
