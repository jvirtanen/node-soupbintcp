'use strict';

const EventEmitter = require('events');
const net = require('net');

const Connection = require('./Connection');
const packet = require('./packet');

class Server extends EventEmitter {

  constructor(port, host, cb) {
    super();

    this._server = net.createServer((socket) => {
      this.emit('session', new Session(socket));
    });

    this._server.listen(port, host, () => {
      this.emit('listening');

      if (cb)
        cb();
    });
  }

  address() {
    return this._server.address();
  }

  close(cb) {
    this._server.close(() => {
      this.emit('close');

      if (cb)
        cb();
    });
  }

};

class Session extends EventEmitter {

  constructor(socket) {
    super();

    this._connection = new Connection(socket, {
      heartbeatPacketType: packet.SERVER_HEARTBEAT,
    });

    this._connection.on('packet', (packetType, payload) => {
      switch (packetType) {
        case packet.DEBUG:
          break;
        case packet.LOGIN_REQUEST:
          this.emit('login', packet.parseLoginRequest(payload));
          break;
        case packet.LOGOUT_REQUEST:
          this.emit('logout');
          break;
        case packet.UNSEQUENCED_DATA:
          this.emit('message', payload);
          break;
        case packet.CLIENT_HEARTBEAT:
          break;
        default:
          this.emit('error', new Error('Unknown packet type: ' + packetType));
      }
    });

    this._connection.on('error', (err) => {
      this.emit('error', err);
    });

    this._connection.on('end', () => {
      this.emit('end');
    });
  }

  accept(payload, cb) {
    this._connection.send(packet.LOGIN_ACCEPTED, packet.formatLoginAccepted(payload), cb);
  }

  reject(payload, cb) {
    this._connection.send(packet.LOGIN_REJECTED, packet.formatLoginRejected(payload), cb);
  }

  send(payload, cb) {
    this._connection.send(packet.SEQUENCED_DATA, payload, cb);
  }

  ending(cb) {
    this._connection.send(packet.END_OF_SESSION);
  }

  end() {
    this._connection.end();
  }

}

module.exports = Server;
