const { Resolver } = require('dns');
const { performance } = require('perf_hooks');

/**
 * resolve DNS by hostname
 * @param {string} host - domain name
 */
const resolveDns = (host) => {
  const resolver = new Resolver();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolver.cancel();
    }, 4000);
    const startTime = performance.now();
    resolver.resolve(host, (err, address, family) => {
      const endTime = performance.now();
      if (err) {
        const error = resolveError(err);
        resolve({ address: error, family, duration: '---' });
      } else {
        resolve({ address, family, duration: endTime - startTime });
      }
    });
  })
}

/**
 * resolves an error from the error object
 * @param {object} err 
 */
const resolveError = (err) => {
  const errorType = JSON.stringify(err).match(/ENOTFOUND|ECANCELLED/);
  let error = '';
  switch (errorType[0]) {
    case 'ENOTFOUND':
      error = 'Error - Domain not found';
      break;
    case 'ECANCELLED':
      error = 'Error - DNS resolve timed out';
      break;
    default:
      error = 'Error...';
  }
  return error;
}

module.exports = {
  resolveDns,
  resolveError
}
