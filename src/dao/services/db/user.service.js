import {handleNotFoundError, handleUniqueIndexError} from "../../../lib/util.js";
import {InternalServerError} from "../../../lib/exceptions/errors.js";
import mongoose from "mongoose";

class UserService {
  constructor(model) {
    this.model = model;
  }

  createUser = async (user) => {
    try {
      return await this.model.create(user);
    } catch (e) {
      handleUniqueIndexError(e, 'Email já cadastrado.');
      throw new InternalServerError(e.message);
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await this.model.findOne({email});
      if (!user) {
        throw new mongoose.Error.DocumentNotFoundError('Usuário não encontrado.');
      }
      return user;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  };

  getUserById = async (id) => {
    try {
      const user = await this.model.findById(id);
      if (!user) {
        throw new mongoose.Error.DocumentNotFoundError('Usuário não encontrado.');
      }
      return user;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  };
}

export default UserService;
