'use strict';

const EventEmitter = require('events');
const net = require('net');

const Connection = require('./Connection');
const packet = require('./packet');

class Client extends EventEmitter {

  constructor(options, cb) {
    super();

    const socket = new net.Socket();

    this._connection = new Connection(socket, {
      heartbeatPacketType: packet.CLIENT_HEARTBEAT,
    });

    this._connection.on('packet', (packetType, payload) => {
      switch (packetType) {
        case packet.DEBUG:
          break;
        case packet.LOGIN_ACCEPTED:
          this.emit('accept', packet.parseLoginAccepted(payload));
          break;
        case packet.LOGIN_REJECTED:
          this.emit('reject', packet.parseLoginRejected(payload));
          break;
        case packet.SEQUENCED_DATA:
          this.emit('message', payload);
          break;
        case packet.SERVER_HEARTBEAT:
          break;
        case packet.END_OF_SESSION:
          this.emit('ending');
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

    socket.connect(options, () => {
      this.emit('connect');

      if (cb)
        cb();
    });
  }

  login(payload, cb) {
    this._connection.send(packet.LOGIN_REQUEST, packet.formatLoginRequest(payload), cb);
  }

  logout(cb) {
    this._connection.send(packet.LOGOUT_REQUEST, cb);
  }

  send(payload, cb) {
    this._connection.send(packet.UNSEQUENCED_DATA, payload, cb);
  }

  end() {
    this._connection.end();
  }

}

module.exports = Client;
