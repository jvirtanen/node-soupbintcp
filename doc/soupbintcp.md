# SoupBinTCP

This package implements NASDAQ SoupBinTCP 3.00 client and server.

## Class: soupbintcp.Client

This class represents a SoupBinTCP client session and extends `EventEmitter`.

### new soupbintcp.Client(options[, callback])

- **options** `Object`
  - **port** `Number`
  - **host** `String`
- **callback** `Function`
- Returns `soupbintcp.Client`

Create a SoupBinTCP client session. The optional **callback** parameter will be
executed when the session is opened.

### Event: 'connect'

Emitted when the session is opened.

### Event: 'accept'

- **payload** `Object`
  - **session** `String`
  - **sequenceNumber** `Number`

Emitted when a Login Accepted packet is received.

### Event: 'reject'

- **payload** `Object`
  - **rejectReasonCode** `String`

Emitted when a Login Rejected packet is received.

### Event: 'message'

- **data** `Buffer`

Emitted when a Sequenced Data packet is received.

### Event: 'ending'

Emitted when an End of Session packet is received.

### Event: 'end'

Emitted when this session is closed.

### Event: 'error'

- **err** `Error`

Emitted when an error occurs.

### client.login(payload[, callback])

- **payload** `Object`
  - **username** `String`
  - **password** `String`
  - **requestedSession** `String`
  - **requestedSequenceNumber** `Number`
- **callback** `Function`

Send a Login Request packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### client.logout([callback])

- **callback** `Function`

Send a Logout Request packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### client.send(payload[, callback])

- **payload** `Buffer`
- **callback** `Function`

Send an Unsequenced Data packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### client.end()

Close this session.

## Class: soupbintcp.Server

This class represents a SoupBinTCP server and extends `EventEmitter`.

### new soupbintcp.Server(options[, callback])

- **options** `Object`
  - **port** `Number`
  - **host** `String`
- **callback** `Function`
- Returns `soupbintcp.Server`

Create a SoupBinTCP server. The optional **callback** parameter will be
executed when the server has started listening for new sessions.

### Event: 'listening'

Emitted when the server has started listening for new sessions.

### Event: 'session'

- **session** `soupbintcp.Session`

Emitted when a new session is opened.

### Event: 'close'

Emitted when this server and all sessions have closed.

### Event: 'error'

- **err** `Error`

Emitted when an error occurs.

### server.address()

- Returns `Object`
  - **port** `Number`
  - **family** `String`
  - **address** `String`

Return the server address.

### server.close([callback])

- **callback** `Function`

Close this server, keeping existing sessions. The optional **callback** will
be executed when all sessions have closed.

## Class: soupbintcp.Session

This class represents a s SoupBinTCP server session and extends
`EventEmitter`.

### Event: 'login'

- **payload** `Object`
  - **username** `String`
  - **password** `String`
  - **requestedSession** `String`
  - **requestedSequenceNumber** `String`

Emitted when a Login Request packet is received.

### Event: 'logout'

Emitted when a Logout Request packet is received.

### Event: 'message'

- **payload** `Buffer`

Emitted when an Unsequenced Data packet is received.

### Event: 'end'

Emitted when this session is closed.

### Event: 'error'

- **err** `Error`

Emitted when an error occurs.

### session.accept(payload[, callback])

- **payload** `Object`
  - **session** `String`
  - **sequenceNumber** `Number`
- **callback** `Function`

Send a Login Accepted packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### session.reject(payload[, callback])

- **payload** `Object`
  - **rejectReasonCode** `String`
- **callback** `Function`

Send a Login Rejected packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### session.send(payload[, callback])

- **payload** `Buffer`
- **callback** `Function`

Send a Sequenced Data packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### session.ending([callback])

- **callback** `Function`

Send an End of Session packet. The optional **callback** parameter will be
executed when the packet is actually written out.

### session.end()

Close this session.
