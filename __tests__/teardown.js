const MemoryDatabaseServer = require('../src/lib/MemoryDatabaseServer');

module.exports = async () => {
  await MemoryDatabaseServer.stop();
};
