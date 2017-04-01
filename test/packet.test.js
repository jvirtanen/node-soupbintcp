'use strict';

const assert = require('assert');

const packet = require('../lib/packet');

describe('Login Accepted', function () {
  const formatted = Buffer.from('       foo                   1', 'ascii');

  it('can be formatted', function () {
    const parsed = {
      session: 'foo',
      sequenceNumber: 1,
    };

    assert.deepEqual(packet.formatLoginAccepted(parsed), formatted);
  });

  it('can be parsed', function () {
    const parsed = {
      session: '       foo',
      sequenceNumber: 1,
    };

    assert.deepEqual(packet.parseLoginAccepted(formatted), parsed);
  });
});

describe('Login Rejected', function () {
  const formatted = Buffer.from('A', 'ascii');

  const parsed = {
    rejectReasonCode: 'A',
  };

  it('can be formatted', function () {
    assert.deepEqual(packet.formatLoginRejected(parsed), formatted);
  });

  it('can be parsed', function () {
    assert.deepEqual(packet.parseLoginRejected(formatted), parsed);
  });
});

describe('Login Request', function () {
  const formatted = Buffer.from('foo   bar              baz                   1', 'ascii');

  it('can be formatted', function () {
    const parsed = {
      username: 'foo',
      password: 'bar',
      requestedSession: 'baz',
      requestedSequenceNumber: 1,
    };

    assert.deepEqual(packet.formatLoginRequest(parsed), formatted);
  });

  it('can be parsed', function () {
    const parsed = {
      username: 'foo   ',
      password: 'bar       ',
      requestedSession: '       baz',
      requestedSequenceNumber: 1,
    };

    assert.deepEqual(packet.parseLoginRequest(formatted), parsed);
  });
});
