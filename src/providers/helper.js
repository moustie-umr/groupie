const TIMEOUT = 20000;
const STORE = require('store');

/**
 * get the token for auth
 */
async function getAuthenticationToken() {
  return STORE.get('USER_TOKEN');
}

/**
 * Takes a relative path and makes it a full URL to API server
 */
export function url(path) {
  const apiRoot = ''; // getConfiguration('API_ROOT');
  return apiRoot + path;
}

function getRequestHeaders(hasBody, token) {
  const headers = hasBody
    ? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    : { Accept: 'application/json' };

  if (token) {
    return { ...headers, Authorization: token };
  }

  return headers;
}

/**
 * Helper function that flattens an object, retaining key structer as a path array:
 */
function toQueryString(obj, urlEncode) {
  function flattenObj(x, path) {
    const result = [];

    path = path || [];
    Object.keys(x).forEach(key => {
      if (!x.hasOwnProperty(key)) return;

      const newPath = path.slice();
      newPath.push(key);

      let vals = [];
      if (typeof x[key] === 'object') {
        vals = flattenObj(x[key], newPath);
      } else {
        vals.push({ path: newPath, val: x[key] });
      }
      vals.forEach(obj => result.push(obj));
    });

    return result;
  } // flattenObj

  // start with  flattening `obj`
  let parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

  // convert to array notation:
  parts = parts.map(varInfo => {
    if (varInfo.path.length === 1) varInfo.path = varInfo.path[0];
    else {
      const first = varInfo.path[0];
      const rest = varInfo.path.slice(1);
      varInfo.path = `${first}[${rest.join('][')}]`;
    }
    return varInfo;
  }); // parts.map

  // join the parts to a query-string url-component
  const queryString = parts.map(varInfo => `${varInfo.path}=${varInfo.val}`).join('&');
  if (urlEncode) return encodeURIComponent(queryString);
  return queryString;
}

/**
 *
 */
async function bodyOf(requestPromise) {
  try {
    const response = await requestPromise;
    return response.body;
  } catch (e) {
    throw e;
  }
}

/**
 * Rejects a promise after `ms` number of milliseconds, it is still pending
 */
function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(reject);
  });
}

/**
 * Constructs and fires a HTTP request
 */
async function sendRequest(method, path, body) {
  try {
    const endpoint = url(path);
    const token = await getAuthenticationToken();
    const headers = getRequestHeaders(body !== null, token);
    const options = body ? { method, headers, body } : { method, headers };

    console.log(endpoint, method);

    return timeout(fetch(endpoint, options), TIMEOUT);
  } catch (e) {
    throw new Error(e);
  }
}

// try to get the best possible error message out of a response
// without throwing errors while parsing
async function getErrorMessageSafely(response) {
  try {
    const body = await response.text();
    if (!body) {
      return '';
    }

    // Optimal case is JSON with a defined message property
    const payload = JSON.parse(body);
    if (payload && payload.message) {
      return payload.message;
    }

    // Should that fail, return the whole response body as text
    return body;
  } catch (e) {
    // Unreadable body, return whatever the server returned
    return response._bodyInit;
  }
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse(path, response) {
  try {
    const { status } = response;

    // `fetch` promises resolve even if HTTP status indicates failure. Reroute
    // promise flow control to interpret error responses as failures
    if (status >= 400) {
      const message = await getErrorMessageSafely(response);
      const error = { status, message };

      // emit events on error channel, one for status-specific errors and other for all errors
      // errors.emit(status.toString(), {path, message: error.message});
      // errors.emit('*', {path, message: error.message}, status);

      throw error;
    }

    // parse response text
    const responseBody = await response.text();
    return {
      status: response.status,
      headers: response.headers,
      body: responseBody ? JSON.parse(responseBody) : null,
    };
  } catch (e) {
    throw e;
  }
}

/**
 * Make best effort to turn a HTTP error or a runtime exception to meaningful error log message
 */
function logError(error, endpoint, method) {
  if (error.status) {
    const summary = `(${error.status} ${error.statusText}): ${error._bodyInit}`;
    console.error(`API request ${method.toUpperCase()} ${endpoint} responded with ${summary}`);
  } else {
    console.error(
      `API request ${method.toUpperCase()} ${endpoint} failed with message "${error.message}"`,
    );
  }
}

/**
 * Make arbitrary fetch request to a path relative to API root url
 * @param {String} method One of: get|post|put|delete
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 */
async function request(method, path, body, suppressRedBox) {
  try {
    const response = await sendRequest(method, path, body);
    return handleResponse(path, response);
  } catch (error) {
    if (!suppressRedBox) {
      logError(error, url(path), method);
    }
    throw error;
  }
}

/**
 * GET a path relative to API root url.
 * @param {String}  path Relative path to the configured API endpoint
 * @param {Object} params if set, is converted to a quey string
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise} of response body
 */
export async function get(path, params, suppressRedBox) {
  if (params) {
    const queryString = toQueryString(params);
    path = `${path}?${queryString}`;
  }

  return bodyOf(request('get', path, null, suppressRedBox));
}

/**
 * POST JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function post(path, body, suppressRedBox) {
  return bodyOf(request('post', path, JSON.stringify(body), suppressRedBox));
}

/**
 * PUT JSON to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function put(path, body, suppressRedBox) {
  return bodyOf(request('put', path, JSON.stringify(body), suppressRedBox));
}

/**
 * DELETE a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function del(path, suppressRedBox) {
  return bodyOf(request('delete', path, null, suppressRedBox));
}

/**
 * POST Formdata to a path relative to API root url
 * @param {String} path Relative path to the configured API endpoint
 * @param {Object} body Anything that you can pass to JSON.stringify
 * @param {Boolean} suppressRedBox If true, no warning is shown on failed request
 * @returns {Promise}  of response body
 */
export async function formdata(path, body, suppressRedBox) {
  try {
    const endpoint = url(path);
    const token = await getAuthenticationToken();
    const headers = getRequestHeaders(token);

    console.log(endpoint, 'formdata');

    const response = await timeout(fetch(endpoint, { method: 'post', headers, body }), TIMEOUT);

    return bodyOf(handleResponse(path, response));
  } catch (error) {
    if (!suppressRedBox) {
      logError(error, url(path), 'file');
    }
    throw error;
  }
}