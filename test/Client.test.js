'use strict';

const assert = require('assert');

const Client = require('../lib/Client');
const Server = require('../lib/Server');

describe('Client', function () {
  let listener;

  let client;
  let server;

  beforeEach(function (done) {
    client = null;
    server = null;

    listener = new Server({
      port: 0,
      host: '127.0.0.1',
    });

    listener.on('listening', () => {
      client = new Client({
        port: listener.address().port,
      });

      if (server)
        done();
    });

    listener.on('session', (session) => {
      server = session;

      if (client)
        done();
    });
  });

  afterEach(function (done) {
    listener.close(() => {
      done();
    });

    client.end();
  });

  it('can send a Login Request packet', function (done) {
    const data = {
      username: 'foo   ',
      password: 'bar       ',
      requestedSession: '          ',
      requestedSequenceNumber: 0,
    };

    server.on('login', (payload) => {
      assert.deepEqual(payload, data);
      done();
    });

    client.login(data);
  });

  it('can send a Logout Request packet', function (done) {
    server.on('logout', () => {
      done();
    });

    client.logout();
  });

  it('can send an Unsequenced Data packet', function (done) {
    const data = Buffer.from('foo', 'ascii');

    server.on('message', (payload) => {
      assert.deepEqual(payload, data);
      done();
    });

    client.send(data);
  });

  it('can receive a Login Accepted packet', function (done) {
    const data = {
      session: '          ',
      sequenceNumber: 0,
    };

    client.on('accept', (payload) => {
      assert.deepEqual(payload, data);
      done();
    });

    server.accept(data);
  });

  it('can receive a Login Rejected packet', function (done) {
    const data = {
      rejectReasonCode: 'A',
    };

    client.on('reject', (payload) => {
      assert.deepEqual(payload, data);
      done();
    });

    server.reject(data);
  });

  it('can receive a Sequenced Data packet', function (done) {
    const data = Buffer.from('foo', 'ascii');

    client.on('message', (payload) => {
      assert.deepEqual(payload, data);
      done();
    });

    server.send(data);
  });

  it('can receive an End of Session packet', function (done) {
    client.on('ending', () => {
      done();
    });

    server.ending();
  });
});
