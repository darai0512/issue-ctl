const request = require('../lib/gh-request');

test('rootEndpoint', () => {
  expect(request.rootEndpoint('api.github.com')).toBe('');
  expect(request.rootEndpoint('myhost.com')).toBe('/api/v3');
});

test('get', async () => {
  // overwrite
  request._request = (options) => new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    expect(options.method).toBe('GET');
    if(options.path === '/repos/a/b/issues?per_page=100&page=1') {
      return resolve({
        headers: {
          link: '<https://api.github.com/repositories/50452949/issues?state=all&direction=asc&per_page=1&page=2>; rel="next", <https://api.github.com/repositories/50452949/issues?state=all&direction=asc&per_page=1&page=8>; rel="last"',
        },
        body: [{test: 1}]
      });
    }
    expect(options.path).toBe('/repos/a/b/issues?per_page=100&page=2');
    return resolve({
      headers: {
        link: '<https://api.github.com/repositories/50452949/issues?state=all&direction=asc&per_page=1&page=8>; rel="last"',
      },
      body: []
    });
  });
  expect(await request.get({
    path: '/repos/a/b/issues',
  }, {})).toEqual([{test: 1}]);
});