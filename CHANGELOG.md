# Release Notes

## 1.0.2 (2024-03-25)

- Fix keep-alive handling (gwn)

  Clear the keep-alive interval before invoking `socket.end()`, which
  terminates the local half of the underlying TCP connection.

## 1.0.1 (2019-03-31)

- Fix typo in documentation

## 0.2.0 (2017-07-29)

- Add `connect` event for client
- Add `listening` event for server
- Add `session` event for server
- Add `close` event for server
- Replace `createClient` with `new Client`
- Replace `createServer` with `new Server`
- Remove `listen` method from server
- Add `options` constructor parameter for client
- Add `options` constructor parameter for server
- Fix `ending` callback in server
- Add reference documentation

## 0.1.2 (2017-03-31)

- Fix `end` event propagation

## 0.1.1 (2017-03-25)

- Fix outbound packet header handling

## 0.1.0 (2017-03-24)

- Initial release
