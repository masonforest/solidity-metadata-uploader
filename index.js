var Promise = require("bluebird");
const path = require('path');
var recursiveReaddir = require("recursive-readdir");
const _ = require("lodash");
var fs = Promise.promisifyAll(require("fs"));
const swarm = require("swarm-js").at("http://swarm-gateways.net");

// If we're running via the truffle cli use truffle's bundled solc
// Otherwise use the default solc compilier.

async function requireSolc(callback) {
    var commandPath = await fs.realpathAsync(process.argv[1]);
    if(path.basename(commandPath) == "cli.bundled.js") {
      return require(`${path.dirname(commandPath)}/../node_modules/solc`);
    } else {
      require('solc');
    }
}

const readFiles = async (dirname) => {
  const filenames = await recursiveReaddir(dirname)
  return await Promise.all(filenames.map(async (filename) => {
      const content = await fs.readFileAsync(filename, 'utf-8')
      return [path.resolve(filename), content];
  }));
};

module.exports.upload = async function upload(filePath, options = {optimized: 1}, callback) {
  if(typeof options === "function") {
    callback = options;
  }

  const solc = await requireSolc();
  const fileName = path.basename(filePath);
  const absoluteFilePath = path.resolve(filePath);
  const contractName = fileName.replace(/.sol$/, '');
  const contractId = `${absoluteFilePath}:${contractName}`
  const workingDirectory = path.dirname(filePath);

  const files =  await readFiles(workingDirectory)
  const input = _.fromPairs(files);
  var output = solc.compile({ sources: input }, options.optimized ? 1 : 0)
  var metadata = JSON.parse(output.contracts[contractId].metadata);
  swarm.upload(JSON.stringify(metadata)).then(callback);
};
