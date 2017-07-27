'use strict';

const soupbintcp = require('../');

const client = soupbintcp.createClient(4000, 'localhost');

client.on('connect', () => {
  client.login({
    username: 'foo',
    password: 'bar',
    requestedSession: '',
    requestedSequenceNumber: 0,
  });
});

client.on('accept', (payload) => {
  client.send(Buffer.from('Hello world!', 'ascii'));
});

client.on('message', (payload) => {
  console.log(payload.toString('ascii'));

  client.logout();
});
