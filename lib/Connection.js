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

    this._socket = socket;

    this._rxTimeoutMillis = options.rxTimeoutMillis || 15000;
    this._txIntervalMillis = options.txIntervalMillis || 1000;

    this._lastRxMillis = Date.now();
    this._lastTxMillis = Date.now();

    this._keepAlive = setInterval(() => {
      const currentMillis = Date.now();

      if (currentMillis - this._lastRxMillis > this._rxTimeoutMillis) {
        this.emit('error', new Error('Heartbeat timeout'));

        this._lastRxMillis = currentMillis;
      }

      if (currentMillis - this._lastTxMillis > this._txIntervalMillis)
        this.send(options.heartbeatPacketType);
    }, options.keepAliveMillis || 100);

    this._socket.on('data', (data) => {
      parser.parse(data);

      this._lastRxMillis = Date.now();
    });

    this._socket.on('end', () => {
      clearInterval(this._keepAlive);

      this.emit('end');
    });

    this._socket.on('error', (err) => {
      this.emit('error', err);
    });
  }

  send(packetType, payload, callback) {
    if (!payload) {
      payload = EMPTY_BUFFER;
    } else if (typeof payload === 'function') {
      callback = payload;
      payload = EMPTY_BUFFER;
    }

    const packetLength = payload.length + 1;

    const header = Buffer.allocUnsafe(3);

    header.writeUInt16BE(packetLength, 0, true);
    header.writeUInt8(packetType, 2, true);

    this._socket.write(header);
    this._socket.write(payload, callback);

    this._lastTxMillis = Date.now();
  }

  end() {
    clearInterval(this._keepAlive);

    this._socket.end();
  }

}

module.exports = Connection;
