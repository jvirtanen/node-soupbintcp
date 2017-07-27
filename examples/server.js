'use strict';

const soupbintcp = require('../');

const server = new soupbintcp.Server(4000);

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
