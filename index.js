const issue = require('./lib/issue');
const pr = require('./lib/pr');
const projects = require('./lib/projects');

// Node.js
module.exports = {
  issue,
  pr,
  projects,
};
// es6 default export compatibility
module.exports.default = module.exports;
