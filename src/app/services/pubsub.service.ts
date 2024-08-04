import { Injectable } from '@angular/core';
import { Socket, io } from "socket.io-client";
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { BtMessage } from '../model/BtMessage';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {

  socket: Socket<any, any>;

  private urlresourceserver: string = environment.resourceserver;

  private btMessageEvent: BehaviorSubject<BtMessage> = new BehaviorSubject(null);

  constructor() {

    this.socket = io(this.urlresourceserver);

    this.socket.on("connect", () => {
      console.log('socket id ' + this.socket.id);
      console.log('socket connected ' + this.socket.connected);
      const engine = this.socket.io.engine;
      console.log('socket trasnsport ' + engine.transport.name);
    });

    this.socket.on("disconnect", (reason) => {

      console.log('socket id ' + this.socket.id);
      console.log('socket connected ' + this.socket.connected);

      if (this.socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(reason);
      }
    });

    this.socket.on('btallwithoutme', (m: BtMessage) => {
      console.log('receiving bt from server whitout me: ' + JSON.stringify(m));
      this.setBtMessageEvent(m);
    });

    this.socket.on('btme', (m: BtMessage) => {
      console.log('receiving bt from server TO me: ' + JSON.stringify(m));
    });


    this.socket.on("connect_error", (error) => {
      if (this.socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(error.message);
      }
    });
  }

  sendBtMessage(message: BtMessage): void {
    this.socket.emit("btmessage", message, (response: any) => {
      console.log(response);
    });

  }

  getBtMessageEvent(): Observable<BtMessage> {
    return this.btMessageEvent.asObservable();
  }

  setBtMessageEvent(event: BtMessage) {
    this.btMessageEvent.next(event);
  }

}
