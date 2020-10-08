const isPortReachable = require("is-port-reachable");

/**
 * using "is-port-reachable", check if domain has specific port opened
 * returns { port, status } where status is either true, false or error
 * @param {string} host - domain url (google.com)
 * @param {number} port - port number
 */
const checkIsPortReachable = async (host, port) => {
  const status = await isPortReachable(port, { timeout: 5000, host })
  return { port, status };
}

/**
 * goes over all the ports of a hostname and returns an array of the results
 * @param {string} hostname 
 * @param {number[]} portsArr 
 */
const scanHostnamePorts = async (hostname, portsArr) => {
  const portScansPromiseArr = portsArr.map(port => checkIsPortReachable(hostname, port));
  return Promise.all(portScansPromiseArr);
}

module.exports = {
  checkIsPortReachable,
  scanHostnamePorts
}