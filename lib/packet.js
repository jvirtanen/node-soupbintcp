'use strict';

exports.DEBUG = 0x2b; // +

exports.LOGIN_ACCEPTED = 0x41; // A
exports.LOGIN_REJECTED = 0x4a; // J
exports.SEQUENCED_DATA = 0x53; // S
exports.SERVER_HEARTBEAT = 0x48; // H
exports.END_OF_SESSION = 0x5a; // Z

exports.LOGIN_REQUEST = 0x4c; // L
exports.UNSEQUENCED_DATA = 0x55; // U
exports.CLIENT_HEARTBEAT = 0x52; // R
exports.LOGOUT_REQUEST = 0x4f; // O

exports.formatLoginRequest = (payload) => {
  const buffer = Buffer.allocUnsafe(46);

  writeStringLeft(buffer, payload.username, 0, 6);
  writeStringLeft(buffer, payload.password, 6, 10);
  writeStringRight(buffer, payload.requestedSession, 16, 10);
  writeNumeric(buffer, payload.requestedSequenceNumber, 26, 20);

  return buffer;
}

exports.parseLoginRequest = (payload) => {
  return {
    username: readString(payload, 0, 6),
    password: readString(payload, 6, 10),
    requestedSession: readString(payload, 16, 10),
    requestedSequenceNumber: readNumeric(payload, 26, 20),
  };
}

exports.formatLoginAccepted = (payload) => {
  const buffer = Buffer.allocUnsafe(30);

  writeStringRight(buffer, payload.session, 0, 10);
  writeNumeric(buffer, payload.sequenceNumber, 10, 20);

  return buffer;
};

exports.parseLoginAccepted = (payload) => {
  return {
    session: readString(payload, 0, 10),
    sequenceNumber: readNumeric(payload, 10, 20),
  };
}

exports.formatLoginRejected = (payload) => {
  const buffer = Buffer.allocUnsafe(1);

  writeStringLeft(buffer, payload.rejectReasonCode, 0, 1);

  return buffer;
};

exports.parseLoginRejected = (payload) => {
  return {
    rejectReasonCode: readString(payload, 0, 1),
  };
}

function readString(buffer, offset, length) {
  return buffer.toString('ascii', offset, offset + length);
}

function readNumeric(buffer, offset, length) {
  return parseInt(readString(buffer, offset, length));
}

function writeStringLeft(buffer, value, offset, length) {
  const count = buffer.write(value, offset, length, 'ascii');

  buffer.fill(0x20, offset + count, offset + length);
}

function writeStringRight(buffer, value, offset, length) {
  const start = length - Math.min(value.length, length);

  buffer.fill(0x20, offset, offset + start);
  buffer.write(value, offset + start, length - start, 'ascii');
}

function writeNumeric(buffer, value, offset, length) {
  writeStringRight(buffer, value.toString(), offset, length);
}
