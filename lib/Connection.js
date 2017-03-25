'use strict';

const EventEmitter = require('events');

const Parser = require('./Parser');

const EMPTY_BUFFER = Buffer.alloc(0);

class Connection extends EventEmitter {

  constructor(socket, options) {
    super();

    const parser = new Parser((packetType, payload) => {
      this.emit('packet', packetType, payload);
    });

    this.socket = socket;

    this.rxTimeoutMillis = options.rxTimeoutMillis || 15000;
    this.txIntervalMillis = options.txIntervalMillis || 1000;

    this.lastRxMillis = Date.now();
    this.lastTxMillis = Date.now();

    this.keepAlive = setInterval(() => {
      const currentMillis = Date.now();

      if (currentMillis - this.lastRxMillis > this.rxTimeoutMillis) {
        this.emit('error', new Error('Heartbeat timeout'));

        this.lastRxMillis = Date.now();
      }

      if (currentMillis - this.lastTxMillis > this.txIntervalMillis)
        this.send(options.heartbeatPacketType);
    }, options.keepAliveMillis || 100);

    this.socket.on('data', (data) => {
      parser.parse(data);

      this.lastRxMillis = Date.now();
    });

    this.socket.on('end', () => {
      clearInterval(this.keepAlive);
    });

    this.socket.on('error', (err) => {
      this.emit('error', err);
    });
  }

  send(packetType, payload, cb) {
    if (!payload) {
      payload = EMPTY_BUFFER;
    } else if (typeof payload === 'function') {
      cb = payload;
      payload = EMPTY_BUFFER;
    }

    const packetLength = payload.length + 1;

    const header = Buffer.allocUnsafe(3);

    header.writeUInt16BE(packetLength, 0, true);
    header.writeUInt8(packetType, 2, true);

    this.socket.write(header);
    this.socket.write(payload, cb);

    this.lastTxMillis = Date.now();
  }

  end() {
    this.socket.end();
  }

}

module.exports = Connection;
