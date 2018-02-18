/* eslint quotes: 0 */
module.exports =
{
  "src": {
    "endpoint": process.env.SRC_ENDPOINT || "api.github.com",
    "repository": process.env.SRC_REPOSITORY || "org/repo",
    "auth": process.env.SRC_AUTH || "oauth2token"
  },
  "dst": {
    "endpoint": process.env.DST_ENDPOINT || "your.enterprise.url",
    "repository": process.env.DST_REPOSITORY || "org/repo",
    "auth": process.env.DST_AUTH || "username:passwd"
  }
};
