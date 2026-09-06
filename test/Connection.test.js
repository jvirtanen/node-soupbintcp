'use strict';

const assert = require('assert');
const net = require('net');
const { afterEach, beforeEach, describe, it } = require('node:test');

const Connection = require('../lib/Connection');
const packet = require('../lib/packet');

const CLIENT_OPTIONS = {
  heartbeatPacketType: packet.CLIENT_HEARTBEAT,
  keepAliveMillis: 10,
  rxTimeoutMillis: 25,
  txIntervalMillis: 10,
};

const SERVER_OPTIONS = {
  heartbeatPacketType: packet.SERVER_HEARTBEAT,
  keepAliveMillis: 10,
  rxTimeoutMillis: 25,
  txIntervalMillis: 50,
};

describe('Connection', function () {
  let listener;

  let client;
  let server;

  beforeEach(function (t, done) {
    client = null;
    server = null;

    listener = net.createServer((connection) => {
      server = new Connection(connection, SERVER_OPTIONS);

      if (client)
        done();
    });

    listener.listen(0, () => {
      const socket = net.connect(listener.address().port);

      client = new Connection(socket, CLIENT_OPTIONS);

      if (server)
        done();
    });
  });

  afterEach(function (t, done) {
    listener.close(() => {
      done();
    });

    client.end();
  });

  it('sends a heartbeat packet', function (t, done) {
    server.on('packet', (packetType, payload) => {
      assert.equal(packetType, packet.CLIENT_HEARTBEAT);

      done();
    });
  });

  it('handles a heartbeat timeout', function (t, done) {
    client.on('error', (err) => {
      assert.equal(err.message, 'Heartbeat timeout');

      done();
    });
  });
});
