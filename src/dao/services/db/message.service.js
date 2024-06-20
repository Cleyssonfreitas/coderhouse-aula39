class MessageService {
  constructor(model) {
    this.model = model;
  }

  async addMessage(data) {
    return this.model.create(data);
  }

  async getMessages() {
    return this.model.aggregate([
      {$sort: {createdAt: -1}},
      {$limit: 10},
      {$sort: {createdAt: 1}}
    ]);
  }
}

export default MessageService;
