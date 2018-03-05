const request = require('./gh-request');

const self = {
  /*
  pullRequest = {
    "issue": 5,
    "head": "darai0512:new-feature",
    "base": "master"
  }
   */
  post: async (hostname, repository, auth, pullRequest) => {
    const {body} = await request.post({
      hostname,
      path: `${request.rootEndpoint(hostname)}/repos/${repository}/pulls`,
      headers: request.commonHeaders(auth),
      method: 'POST',
    }, pullRequest);
    console.log(`posted pull request #${body.number}`);
    // check mergable
    /*
    const {body: getBody} = await request.get({
      hostname,
      path: `${request.rootEndpoint(hostname)}/repos/${repository}/pulls/${body.number}`,
      headers: request.commonHeaders(auth),
    });
    let mergeStatus = '';
    if (getBody.mergeable) {
      mergeStatus = ': mergeable';
    } else if (getBody.mergeable === false) {
      mergeStatus = ': conflict';
    }
    console.log(`posted pull request #${body.number}${mergeStatus}`);
    */
  },
};

module.exports = self;
