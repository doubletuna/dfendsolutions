const util = require('./src/utils');
const { resolveDns } = require('./src/dns.service');
const { scanHostnamePorts } = require('./src/port.service');

/**
 * receives the processed file data, then
 * goes over all hostnames/ports to do:
 * resolve hostname DNS & runs port scan
 * @param {*} processedFileData 
 */
const combineDnsAndPortScanResults = (processedFileData) => {
  const promiseArr = Object.entries(processedFileData).map(async ([host, ports]) => {
    try {
      const resolvedDns = await resolveDns(host);
      const combinedPortScans = await scanHostnamePorts(host, ports);

      return { [host]: { resolvedDns, combinedPortScans } };
    } catch (error) {
      return { [host]: { resolvedDns: {}, combinedPortScans: [] } };
    }
  })

  return Promise.all(promiseArr);
}

/**
 * main function, resolves filename, captures '--json' flag - to set output type
 * JSON or txt
 */
const main = async () => {
  const args = process.argv;
  const fileName = args[2];
  const isJson = !!args.find(arg => arg === '--json');

  if (!fileName) {
    console.log('missing file name!');
    console.log('example: node src/main.js hosts-ports.txt');
    process.exit(0);
  }

  try {
    const fileData = await util.readFile(fileName);
    const processedFileData = util.processFileData(fileData);
    const finalResult = await combineDnsAndPortScanResults(processedFileData);

    if (isJson) {
      util.generateJsonOutput(finalResult);
    } else {
      util.generteTextOutput(finalResult);
    }
  } catch (error) {
    console.log(error);
  }
}

main();