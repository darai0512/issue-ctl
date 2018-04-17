const issue = require('./lib/issue');
const pr = require('./lib/pr');

// Node.js
module.exports = {
  issue,
  pr,
};
// es6 default export compatibility
module.exports.default = module.exports;
