const request = require('./gh-request')
const querystring = require('querystring')
const issueConf = require('../conf/issue')

const path = '/repos/:repository/issues'

const self = {
  get: async (endpoint, repository, auth) => {
    const query = {
      state: 'open', // 'all',
      direction: 'asc',
      page: 1,
    }
    endpoint += path.replace(':repository', repository)
    const issues = [];
    while (1) {
      console.log(`get page: ${query.page}`)
      const responses = await request(self.qs(endpoint, query), auth)
      if (!Array.isArray(responses) || responses.length === 0) {
        break
      }
      for (const issue of responses) {
        if (typeof issue.pull_request === 'object') {
          continue
        }
        issues.push({
          number: issue.number,
          title: issueConf.title(issue.title),
          body: issue.body,
          assignees: issue.assignees,
          milestone: issue.milestone,
          labels: issue.labels,
        })
      }
      query.page++
    }
    console.log(`issue count: ${issues.length}`)
    return issues
  },
  post: async (endpoint, repository, auth, issues) => {
    endpoint += path.replace(':repository', repository)
    const end = issues.length
    let i = 0;
    const timeout = setInterval(() => {
      const body = issues[i++]
      if (i === end)
        clearInterval(timeout)
      console.log(`post issue number=${body.number}`)
      delete body.number
      request(endpoint, auth, {method: 'POST', body})
    }, 100)
  },
  qs: (url, query) => url + '?' + querystring.stringify(query, null, null, {
    encodeURIComponent: querystring.unescape
  }),
}

module.exports = self
