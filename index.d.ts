import { EventEmitter } from 'events';
import { AddressInfo, ListenOptions, NetConnectOpts } from 'net';

export type ClientOptions = NetConnectOpts;

export type ServerOptions = ListenOptions;

export interface LoginRequest {
  username: string;
  password: string;
  requestedSession: string;
  requestedSequenceNumber: number;
}

export interface LoginAccepted {
  session: string;
  sequenceNumber: number;
}

export interface LoginRejected {
  rejectReasonCode: string;
}

export interface ClientEvents {
  connect: [];
  accept: [payload: LoginAccepted];
  reject: [payload: LoginRejected];
  message: [payload: Buffer];
  ending: [];
  end: [];
  error: [err: Error];
}

export interface ServerEvents {
  listening: [];
  session: [session: Session];
  close: [];
  error: [err: Error];
}

export interface SessionEvents {
  login: [payload: LoginRequest];
  logout: [];
  message: [payload: Buffer];
  end: [];
  error: [err: Error];
}

export class Client extends EventEmitter<ClientEvents> {
  constructor(options: ClientOptions, callback?: () => void);

  login(payload: LoginRequest, callback?: () => void): void;
  logout(callback?: () => void): void;
  send(payload: Uint8Array, callback?: () => void): void;
  end(): void;
}

export class Server extends EventEmitter<ServerEvents> {
  constructor(options: ServerOptions, callback?: () => void);

  address(): AddressInfo | string | null;
  close(callback?: () => void): void;
}

declare class Session extends EventEmitter<SessionEvents> {
  private constructor();

  accept(payload: LoginAccepted, callback?: () => void): void;
  reject(payload: LoginRejected, callback?: () => void): void;
  send(payload: Uint8Array, callback?: () => void): void;
  ending(callback?: () => void): void;
  end(): void;
}

export type { Session };
