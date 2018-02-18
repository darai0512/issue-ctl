# Feature

Migrates issues from one repository to another. These are posted as new one.

## Usecase

1. Publishes from GitHub Enterprise to GitHub though including a part of unpublished code. You need wrap it, so cannot use Migration of GitHub API due to exposing commit log.

# How to Use

This is only dependant on Node.js over `v8.0.0`.
NPM dependencies are nothing!

You can use this as CLI or Client Library.

## CLI
### Install

```
# stable
$npm i -g issue-ctl
# or
$yarn i -g issue-ctl
```

### Setup

Sets credencial information to your [environment variables](./conf/credentials.js).

Or, you can rewrite configure file.
```
$sudo vim $(dirname $(which issue-ctl))/../lib/node_modules/issue-ctl/conf/credentials.js
module.exports =
{
  "src": {
    "endpoint": "your.enterprise.url",
    "repository": "org/repo",
    "auth": "oauth2token or username:passwd"
  },
  "dst": {
    "endpoint": "api.github.com",
    "repository": "org/repo",
    "auth": "oauth2token or username:passwd"
  }
}
```

Basic Authentication(=your GitHub login `username:password`) or OAuth2(=Personal access token) are available.

In case of OAuth2, you need the following scopes.

- repo
- admin:org

Checks on GitHub->Settings->Personal access token->Select scopes

### Execute

```
$issue-ctl migrate
# or, get issues on local
$issue-ctl get > /tmp/issues.json
# post by environment variables after editting issues
$DST_ENDPOINT=api.github.com DST_REPOSITORY=darai0512/test DST_AUTH=darai0512:*** issue-ctl post /tmp/issues.json
```

|subcommand|arguments|description|
|---|---|---|
|get||displays all open issues from `src` as JSON format|
|post|(JSON_absolute_path)|creates new issues of JSON_absolute_path to `dst`|
|migrate||gets and posts issues from `src` to `dst`|

## Client Library
### Install

```
# stable
$npm i issue-ctl
# or
$yarn i issue-ctl

# beta version
$npm i git+https://git@github.com/darai0512/issue-ctl
```

### Usage

```
const {issue} = require('issue-ctl');

const main = async () => {
  const issues = await issue.get('api.github.com', 'org/repo', 'username:passwd');
  // ex, issues.title = prefix + issues.title + postfix;
  await issue.post('your.enterprise.url', 'org/repo', 'oauth2token', issues);
};

main().catch((err) => console.error(err));
```

# Authentication

Basic Authentication(=your GitHub login `username:password`) or OAuth2(=Personal access token) are available.

In case of OAuth2, you need the following scopes.

- repo
- admin:org

Checks on GitHub->Settings->Personal access token->Select scopes

# References
## available API

|tool|version|available APIs|
| --- | --- | --- |
|GitHub| |Rest v3 or GraphQL|
|GitHub Enterprise|>= 2.10|Rest v3 or GraphQL|
||< 2.10|Rest v3|
|GitLab(in the future???)|???|???|
