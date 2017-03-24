'use strict';

const soupbintcp = require('../');

const client = soupbintcp.createClient(4000, 'localhost', () => {
  client.login({
    username: 'foo',
    password: 'bar',
    requestedSession: '',
    requestedSequenceNumber: 0,
  });
});

client.on('accept', function(payload) {
  client.send(Buffer.from('Hello world!', 'ascii'));
});

client.on('message', function(payload) {
  console.log(payload.toString('ascii'));

  client.logout();
});
