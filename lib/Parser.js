'use strict';

class Parser {

  constructor(cb) {
    this._buffer = null;
    this._offset = 0;

    this._cb = cb;
  }

  parse(data) {
    if (this._buffer) {
      this._buffer = Buffer.concat([this._buffer, data]);
    } else {
      this._buffer = data;
      this._offset = 0;
    }

    do {
      if (this._buffer.length - this._offset < 2)
        return;

      const packetLength = this._buffer.readUInt16BE(this._offset, true);

      if (this._buffer.length - this._offset < 2 + packetLength)
        return;

      const packetType = this._buffer.readUInt8(this._offset + 2, true);
      const payload = this._buffer.slice(this._offset + 3, this._offset + 2 + packetLength);

      this._cb(packetType, payload);

      this._offset += 2 + packetLength;
    } while (this._offset !== this._buffer.length);

    this._buffer = null;
  }

}

module.exports = Parser;
