'use strict';

const Client = require('./lib/Client');
const Server = require('./lib/Server');

exports.createClient = (port, host, cb) => {
  return new Client(port, host, cb);
};

exports.createServer = (cb) => {
  return new Server(cb);
};
