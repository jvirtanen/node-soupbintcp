'use strict';

const soupbintcp = require('../');

const server = soupbintcp.createServer((session) => {
  session.on('login', (payload) => {
    session.accept({
      session: payload.requestedSession,
      sequenceNumber: payload.requestedSequenceNumber,
    });
  });

  session.on('message', (payload) => {
    session.send(payload);
  });

  session.on('logout', () => {
    session.end();
  });
});

server.listen(4000);
