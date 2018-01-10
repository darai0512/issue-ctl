const fetch = require('node-fetch')
module.exports = async (url, auth, options = {}) => {
  // TODO for GraphQL header???
  if (typeof options.headers === 'undefined')
    options.headers = {Accept: 'application/vnd.github.v3+json'}
  else
    options.headers.Accept = 'application/vnd.github.v3+json'
  // Auth is 3 way, but supporting basic auth or OAuth2.
  options.headers.Authorization = auth.includes(':')
    ? `Basic ${Buffer.from(auth, 'utf8').toString('base64')}`
    : `token ${auth}`
  if (typeof options.body === 'object')
    options.body = JSON.stringify(options.body)
  try {
    let res = await fetch(url, options);
    // res.headers.raw() => paging: link[0]
    return await res.json(); // only body
  } catch (err) {
    console.error(err)
  }
}
