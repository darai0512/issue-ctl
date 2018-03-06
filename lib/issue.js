const request = require('./gh-request');

const self = {
  get: async (hostname, repository, auth) => {
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/issues`;
    const [issue_prs, comments] = await Promise.all([request.get({
        hostname,
        headers: request.commonHeaders(auth),
        path,
      }, {
        state: 'all',
        direction: 'asc',
      }),
      request.get({
        hostname,
        headers: request.commonHeaders(auth),
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
    const issues = [];
    for (const issue of issue_prs) {
      if (typeof issue.pull_request === 'object') {
        continue;
      }
      const assignees = [];
      for (const assignee of issue.assignees) {
        assignees.push(assignee.login);
      }
      const labels = [];
      for (const label of issue.labels) {
        labels.push(label.name);
      }
      issues.push({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        assignees,
        milestone: issue.milestone,
        labels,
        state: issue.state,
        comments: commentsOf[issue.url] || [],
      });
    }
    return issues;
  },
  // @TODO regist labels in advance
  post: (hostname, repository, auth, issues) => {
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/issues`;
    const end = issues.length;
    let i = 0;
    const timeout = setInterval(async () => {
      const issue = issues[i++];
      if (i === end)
        clearInterval(timeout);
      const {body} = await request.post({
        hostname,
        path,
        headers: request.commonHeaders(auth),
        method: 'POST',
      }, issue);
      console.log(`posted old issue#${issue.number} to new issue#${body.number}`);
      for (const comment of issue.comments) {
        await request.post({
          hostname,
          path: path + `/${body.number}/comments`,
          headers: request.commonHeaders(auth),
          method: 'POST',
        }, comment);
      }
      if (issue.state === 'closed') {
        await request.post({
          hostname,
          path: path + '/' + body.number,
          headers: request.commonHeaders(auth),
          method: 'PATCH',
        }, {state: 'closed'});
      }
    }, 1000);
  },
};

module.exports = self;
