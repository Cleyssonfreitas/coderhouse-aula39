import { Server } from "socket.io";

class SocketServer {
  constructor() {
    if (!SocketServer.instance) {
      this.io = null;
      SocketServer.instance = this;
    }
    return SocketServer.instance;
  }

  start(server) {
    this.io = new Server(server);
  }

  get() {
    return this.io;
  }
}

const instance = new SocketServer();
export default instance;
