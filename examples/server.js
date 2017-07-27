'use strict';

const soupbintcp = require('../');

const server = new soupbintcp.Server();

server.on('session', (session) => {
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
