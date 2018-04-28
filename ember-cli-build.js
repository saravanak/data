/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const merge    = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const yuidoc   = require('./lib/yuidoc');

let BUILD_BOTH = false;
let args = process.argv;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--build-both') {
    BUILD_BOTH = true;
  }
}

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {});

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  let appTree = app.toTree();

  if (BUILD_BOTH) {
    console.log('Building both RFC and Canary Branches of ember-data');
    const rfcApp = new EmberAddon(defaults, {
      recordDataRFCBuild: true
    });
    const rfcTree = new Funnel(rfcApp.toTree(), {
      destDir: './rfc-dist'
    });
    appTree = new Funnel(appTree, {
      destDir: './canary-dist'
    });

    appTree = merge([appTree, rfcTree]);
  }

  if (process.env.EMBER_ENV === 'production') {
    return merge([appTree, yuidoc()]);
  } else {
    return appTree;
  }
};
