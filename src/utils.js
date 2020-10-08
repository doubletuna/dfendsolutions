const fs = require('fs');
const path = require('path');

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, `../${fileName}`), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

/**
 * generates a new data structure from the input file
 * an array of objects, structured: {hostname: string, ports: number[]}
 * @param {string} fileData - input file
 */
const processFileData = (fileData) => {
  const fileDataRows = fileData.split('\n');
  return fileDataRows.reduce((obj, data) => {
    const hostname = data.split(' ')[0];
    const port = Number(data.split(' ')[1]);

    obj[hostname] ? obj[hostname].push(port) : obj[hostname] = [port];
    return obj;
  }, {});
}

/**
 * outputs the result as JSON
 * @param {*} finalResult - hostname DNS & port scans
 */
const generateJsonOutput = (finalResult) => {
  console.log(JSON.stringify(finalResult));
}

/**
 * outputs the result as text (default)
 * @param {*} finalResult - hostname DNS & port scans
 */
const generteTextOutput = (finalResult) => {
  finalResult.forEach(element => {
    for (const [key] of Object.entries(element)) {
      console.log(`\nHost Name: ${key}`);
      console.log(`IP: ${element[key].resolvedDns.address}, Duration (ms): ${element[key].resolvedDns.duration}`);
      element[key].combinedPortScans.forEach(portCheck => {
        console.log(`Port: ${portCheck.port}, Status: ${portCheck.status}`);
      })
    }
  });
}

module.exports = {
  readFile,
  processFileData,
  generateJsonOutput,
  generteTextOutput
}