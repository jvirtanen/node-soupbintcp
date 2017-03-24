'use strict';

const assert = require('assert');

const Parser = require('../lib/Parser');
const packet = require('../lib/packet');

describe('Parser', function () {
  it('parses one packet', function (done) {
    const data = [0x00, 0x04, 0x55, 0x66, 0x6f, 0x6f];

    const parser = new Parser((packetType, payload) => {
      assert.equal(packetType, packet.UNSEQUENCED_DATA);
      assert.deepEqual(payload, [0x66, 0x6f, 0x6f]);

      done();
    });

    parser.parse(Buffer.from(data));
  });

  it('parses multiple packets', function (done) {
    const data = [0x00, 0x04, 0x55, 0x66, 0x6f, 0x6f,
      0x00, 0x04, 0x55, 0x62, 0x61, 0x72];

    const payloads = [];

    const parser = new Parser((packetType, payload) => {
      payloads.push(payload);

      if (payloads.length == 2) {
        assert.deepEqual(payloads[0], [0x66, 0x6f, 0x6f]);
        assert.deepEqual(payloads[1], [0x62, 0x61, 0x72]);

        done();
      }
    });

    parser.parse(Buffer.from(data));
  });

  it('handles packet length fragment', function (done) {
    const parser = new Parser((packetType, payload) =>  {
      assert.equal(packetType, packet.UNSEQUENCED_DATA);
      assert.deepEqual(payload, [0x66, 0x6f, 0x6f]);

      done();
    });

    parser.parse(Buffer.from([0x00]));
    parser.parse(Buffer.from([0x04, 0x55, 0x66, 0x6f, 0x6f]));
  });

  it('handles packet type fragment', function (done) {
    const parser = new Parser((packetType, payload) => {
      assert.equal(packetType, packet.UNSEQUENCED_DATA);
      assert.deepEqual(payload, [0x66, 0x6f, 0x6f]);

      done();
    });

    parser.parse(Buffer.from([0x00, 0x04]));
    parser.parse(Buffer.from([0x55, 0x66, 0x6f, 0x6f]));
  });

  it('handles payload fragment', function (done) {
    const parser = new Parser((packetType, payload) => {
      assert.equal(packetType, packet.UNSEQUENCED_DATA);
      assert.deepEqual(payload, [0x66, 0x6f, 0x6f]);

      done();
    });

    parser.parse(Buffer.from([0x00, 0x04, 0x55, 0x66]));
    parser.parse(Buffer.from([0x6f, 0x6f]));
  });

  it('handles multiple fragments', function (done) {
    const parser = new Parser((packetType, payload) => {
      assert.equal(packetType, packet.UNSEQUENCED_DATA);
      assert.deepEqual(payload, [0x66, 0x6f, 0x6f]);

      done();
    });

    parser.parse(Buffer.from([0x00, 0x04]));
    parser.parse(Buffer.from([0x55, 0x66]));
    parser.parse(Buffer.from([0x6f, 0x6f]));
  });
});
