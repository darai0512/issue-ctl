const request = require('./gh-request');

const self = {
  get: async (hostname, repository, auth) => {
    const headers = request.commonHeaders(auth);
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/issues`;
    const [issues, comments] = await Promise.all([request.get({
        hostname,
        headers,
        path,
      }, {
        state: 'all',
        direction: 'asc',
      }),
      request.get({
        hostname,
        headers,
        path: path + '/comments',
      }, {
      })
    ]);
    const commentsOf = {};
    for (const comment of comments) {
      if (typeof commentsOf[comment.issue_url] === 'undefined') {
        commentsOf[comment.issue_url] = [{
          body: comment.body
        }];
      } else {
        commentsOf[comment.issue_url].push({
          body: comment.body
        });
      }
    }
    for (const [i, issue] of issues.entries()) {
      if (typeof issue.pull_request === 'object') {
        issues.splice(i, 1);
        continue;
      }
      issues[i] = {
        number: issue.number,
        title: issue.title,
        body: issue.body,
        assignees: issue.assignees,
        milestone: issue.milestone,
        labels: issue.labels,
        state: issue.state,
        comments: commentsOf[issue.url] || [],
      };
    }
    return issues;
  },
  post: (hostname, repository, auth, issues) => {
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/issues`;
    const headers = request.commonHeaders(auth);
    const end = issues.length;
    let i = 0;
    const timeout = setInterval(async () => {
      const issue = issues[i++];
      if (i === end)
        clearInterval(timeout);
      const {body} = await request.post({
        hostname,
        path,
        headers,
        method: 'POST',
      }, issue);
      console.log(`posted old issue#${issue.number} to new issue#${body.number}`);
      for (const comment of issue.comments) {
        await request.post({
          hostname,
          path: path + `/${body.number}/comments`,
          headers,
          method: 'POST',
        }, comment);
      }
      if (issue.state === 'closed') {
        await request.post({
          hostname,
          path: path + '/' + body.number,
          headers,
          method: 'PATCH',
        }, {state: 'closed'});
      }
    }, 1000);
  },
};

module.exports = self;
