import * as Party from "partykit/server";

type Cursor = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext): void | Promise<void> {
    console.log("A user connected:", connection.id);
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const cursor: Cursor = JSON.parse(message);
      this.room.broadcast(JSON.stringify(cursor));
    } catch (e) {
      console.log("bad message", e);
    }
  }

 onClose(connection: Party.Connection): void | Promise<void> {
   console.log(`Connection closed: ${connection.id}`);
 }
}

Server satisfies Party.Worker;
