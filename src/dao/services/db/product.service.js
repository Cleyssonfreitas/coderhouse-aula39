import {InternalServerError} from "../../../lib/exceptions/errors.js";
import mongoose from "mongoose";
import {handleNotFoundError, handleUniqueIndexError, handleValidationErrors} from "../../../lib/util.js";

class ProductService {
  constructor(model) {
    this.model = model;
  }

  getProducts = async ({limit, page, sort, query}) => {
    const aggregateArray = [];
    if (sort === 'asc') {
      aggregateArray.push({$sort: {price: 1}});
    } else if (sort === 'desc') {
      aggregateArray.push({$sort: {price: -1}});
    }
    if (query) {
      aggregateArray.push({$match: {category: {$regex: query, $options: 'i'}}});
    }
    try {
      const aggregate = this.model.aggregate(aggregateArray);
      const queryResult = await this.model.aggregatePaginate(aggregate, {limit, page, lean: true});
      return {
        status: 'sucesso',
        payload: queryResult.docs,
        totalPages: queryResult.totalPages,
        prevPage: queryResult.prevPage,
        nextPage: queryResult.nextPage,
        page: queryResult.page,
        hasPrevPage: queryResult.hasPrevPage,
        hasNextPage: queryResult.hasNextPage,
        prevLink: !queryResult.hasPrevPage ? null : (`${process.env.BASE_URL}/products?limit=${limit}&page=${queryResult.prevPage}` + (sort ? `&sort=${sort}` : '') + (query ? `&query=${query}` : '')),
        nextLink: !queryResult.hasNextPage ? null : (`${process.env.BASE_URL}/products?limit=${limit}&page=${queryResult.nextPage}` + (sort ? `&sort=${sort}` : '') + (query ? `&query=${query}` : '')),
      };
    } catch (e) {
      throw new InternalServerError(e.message);
    }
  };

  addProduct = async (product) => {
    try {
      return await this.model.create(product);
    } catch (e) {
      handleValidationErrors(e);
      handleUniqueIndexError(e, 'Código já existe.');
      throw new InternalServerError(e.message);
    }
  }

  getProductById = async (id) => {
    try {
      const product = await this.model.findById(id);
      if (!product) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return product;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  };

  updateProduct = async (id, product) => {
    try {
      const updatedProduct = await this.model.findByIdAndUpdate(id, product, {returnDocument: "after", runValidators: true});
      if (!updatedProduct) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return updatedProduct;
    } catch (e) {
      handleValidationErrors(e);
      handleNotFoundError(e);
      handleUniqueIndexError(e, 'Código já existe.');
      throw new InternalServerError(e.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      const product = await this.model.findByIdAndDelete(id);
      if (!product) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return product;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }
}

export default ProductService;
