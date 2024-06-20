import fs from 'fs';

class PersistenceService {
  constructor(path) {
    this.path = path;
  }

  readItems = async () => {
    try {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      if (!fileData.trim()) {
        return [];
      }
      return JSON.parse(fileData);
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fs.promises.writeFile(this.path, '[]');
        return [];
      }
      throw e;
    }
  }

  saveItems = async (items) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(items));
    } catch (e) {
      throw e;
    }
  }
}

export default PersistenceService;
