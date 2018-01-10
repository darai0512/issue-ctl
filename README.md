# Feature

- Migrates issues from one repository to another.
  - Posted as new issues by executed user.

# Usecase

1. Publishes from GitHub Enterprise to GitHub though including a part of unpublished code. You need wrap it, so cannot use Migration of GitHub API due to exposing commit log.

# How to Use

Depends on node.js over v8.0.0

## Install

```
# latest version (include beta version)
$npm i -g git+https://git@github.com/darai0512/issue-ctl
# stable
$npm i -g issue-ctl
# or
$yarn i -g issue-ctl
```

## Setup

Sets credencial information to your [environment variables](./conf/credentials.js).
Or, you can rewrite configure file.
```
$sudo vim $(dirname $(which issue-ctl))/../lib/node_modules/issue-ctl/conf/credentials.js
module.exports =
{
  "src": {
    "endpoint": "http://your.enterprise.url/api/v3",
    "repository": "org/repo",
    "auth": "oauth2token"
  },
  "dst": {
    "endpoint": "https://api.github.com",
    "repository": "org/repo",
    "auth": "username:passwd"
  }
}
```

Note: In case of enterprise, please add [the path `/api/v3`](https://developer.github.com/enterprise/2.11/v3/#root-endpoint) in `endpoint`.

Basic Authentication(=your GitHub login `username:password`) or OAuth2(=Personal access token) are available.
In case of OAuth2, you need the following scopes.

- repo
- admin:org

Checks on GitHub->Settings->Personal access token->Select scopes

## Execute

```
$issue-ctl migrate
```

|subcommand|arguments|description|
|---|---|---|
|get||displays all open issues from `src` as JSON format|
|post|<issue JSON path>|creates new issues to `dst` as open status|
|migrate||gets and posts issues from `src` to `dst`|
