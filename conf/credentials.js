module.exports =
{
  "src": {
    "endpoint": process.env.SRC_ENDPOINT || "http://your.enterprise.url/api/v3",
    "repository": process.env.SRC_REPOSITORY || "org/repo",
    "auth": process.env.SRC_AUTH || "oauth2token"
  },
  "dst": {
    "endpoint": process.env.DST_ENDPOINT || "https://api.github.com",
    "repository": process.env.DST_REPOSITORY || "org/repo",
    "auth": process.env.DST_AUTH || "username:passwd"
  }
}
