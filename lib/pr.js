const request = require('./gh-request');

const self = {
  /*
  results.mergeable
    - true: mergeable
    - false: conflict
    - null: unknown
   */
  get: async (hostname, repository, auth, number) => {
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/pulls`;
    const [body] = await request.get({
      hostname,
      path: `${path}/${number}`,
      headers: request.commonHeaders(auth),
    });
    return body;
  },
  /*
  create = {
    "issue": 5,
    "head": "darai0512:new-feature",
    "base": "master"
  }
   */
  post: async (hostname, repository, auth, create) => {
    const path = `${request.rootEndpoint(hostname)}/repos/${repository}/pulls`;
    const {body} = await request.post({
      hostname,
      path,
      headers: request.commonHeaders(auth),
      method: 'POST',
    }, create);
    return body;
  },
};

module.exports = self;
