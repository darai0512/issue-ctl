const https = require('https');
const querystring = require('querystring');

const pageRegexp = /page=(\d+)>; rel="next"/;

const self = {
  get: async (options, params = {}) => {
    options.method = 'GET';
    params.per_page = 100;
    params.page = 1;
    const path = options.path;
    const responseBody = [];
    while (true) {
      options.path = path + '?' + querystring.stringify(params, null, null, {
        encodeURIComponent: querystring.unescape
      });
      const {headers, body} = await self._request(options).catch((err) => {
        throw new Error(err);
      });
      if (!Array.isArray(body))
        return [body];
      responseBody.push(...body);
      if (typeof headers.link !== 'string')
        break;
      const page = headers.link.match(pageRegexp);
      if (page === null)
        break;
      params.page = page[1];
    }
    return responseBody;
  },
  post: (options, params = {}) => {
    options.headers['content-type'] = 'application/json';
    params = JSON.stringify(params);
    options.headers['content-length'] = Buffer.byteLength(params);
    return self._request(options, params);
  },
  rootEndpoint: (domain) => {
    // https://developer.github.com/enterprise/2.11/v3/#root-endpoint
    if (domain !== 'api.github.com')
      return '/api/v3';
    return '';
  },
  commonHeaders: (auth) => {
    // TODO for GraphQL header???
    headers = {Accept: 'application/vnd.github.v3+json'};
    // Auth is 3 way, but supporting basic auth or OAuth2.
    headers.Authorization = auth.includes(':')
      ? `Basic ${Buffer.from(auth, 'utf8').toString('base64')}`
      : `token ${auth}`;
    headers['user-agent'] = 'issue-ctl/1.0';
    headers['accept'] = '*/*';
    return headers;
  },
  _request: (options, bodyStr) => new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        return resolve({
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    }).on('error', (err) => {
      return reject(err);
    });
    if (bodyStr)
      req.write(bodyStr);
    req.end();
  }),
};

module.exports = self;