import ProfanityService from "./profanity/profanity.service.js";
import {censorWord, isProfane} from "../util.js";
import MessageService from "../../dao/services/db/message.service.js";
import messageModel from "../../dao/models/message.model.js";

const messageService = new MessageService(messageModel);

class ChatService {
  constructor() {
    if (!ChatService.instance) {
      this.users = new Set();
      this.message = { user: '', message: '' };
      ChatService.instance = this;
    }
    return ChatService.instance;
  }

  attachListeners = (io) => {
    const updateUsersQty = () => {
      const usersQty = io.engine.clientsCount;
      io.emit('usersQty', usersQty);
    }
    io.on('connection', async socket => {
      socket.on('join', async (username) => {
        this.message = {user: 'coder-chat-server', message: `${username} entrou na sala`};
        socket.broadcast.emit('message', this.message);
        socket.broadcast.emit('join', username);
        this.users.add({id: socket.id, username: username});
        updateUsersQty();
        io.to(socket.id).emit('messages', await messageService.getMessages());
      });
      socket.on('message', async (userMessage) => {
        const word = censorWord(userMessage.text);
        if (word.censored) {
          this.message = {user: userMessage.user, message: word.word};
          io.to(socket.id).emit('censored', userMessage.message);
        } else {
          this.message = {user: userMessage.user, message: userMessage.message};
        }
        await messageService.addMessage(this.message);
        updateUsersQty();
        io.emit('message', this.message);
      });
      socket.on('disconnect', async () => {
        const user = Array.from(this.users).find(user => user.id === socket.id);
        if (user) {
          this.message = {user: 'coder-chat-server', message: `${user.username} saiu da sala`};
          io.emit('message', this.message);
          this.users.delete(user);
        }
        updateUsersQty();
      });
    });
  }

  userCheck = (username) => {
    const userExists = Array.from(this.users).find(user => {
      const regex = new RegExp(`^${username}$`, 'i');
      return regex.test(user.username);
    });
    if (!userExists && !isProfane(username)) {
      return {status: 204};
    } else if (isProfane(username)) {
      return {status: 400, error: 'Nome de usuário contém palavras impróprias'};
    } else {
      return {status: 403, error: 'Nome de usuário já existe'};
    }
  }
}

const instance = new ChatService(new ProfanityService());
export default instance;
