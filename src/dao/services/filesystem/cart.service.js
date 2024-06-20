import {InternalServerError, NotFoundError} from "../../../lib/exceptions/errors.js";

class CartService {
  constructor(persistence) {
    this.persistence = persistence;
  }

  #readCarts = async () => {
    try {
      return await this.persistence.readItems();
    } catch (e) {
      throw InternalServerError(e.message);
    }
  }

  #saveCarts = async (carts) => {
    try {
      await this.persistence.saveItems(carts);
    } catch (e) {
      throw InternalServerError(e.message);
    }
  }

  getCartById = async (id) => {
    try {
      const carts = await this.#readCarts();
      const cart = carts.find((cart) => cart.id === +id);
      if (!cart) {
        throw new NotFoundError("Carrinho não encontrado.");
      }
      return cart;
    } catch (e) {
      throw e;
    }
  }

  addCart = async (cart) => {
    try {
      const carts = await this.#readCarts();
      const lastId = carts[carts.length - 1]?.id ?? 0;
      const newCart = {
        id: lastId + 1,
        products: cart.products?.length > 0 ? cart.products : []
      }
      carts.push(newCart);
      await this.#saveCarts(carts);
      return newCart;
    } catch (e) {
      throw e;
    }
  }

  addProductToCart = async (id, product) => {
    try {
      product.product = +product.product;
      const carts = await this.#readCarts();
      let cIndex;
      const cart = carts.find((cart, i) => {
        cIndex = i;
        return cart.id === +id;
      });
      if (!cart) {
        throw new NotFoundError("Carrinho não encontrado.");
      }
      let pIndex;
      const existingProduct = cart.products.find((p, i) => {
        pIndex = i;
        return p.product === product.product;
      });
      if (existingProduct) {
        cart.products[pIndex].quantity += product.quantity;
      } else {
        cart.products.push(product);
      }
      carts.splice(cIndex, 1, cart);
      await this.#saveCarts(carts);
      return cart;
    } catch (e) {
      throw e;
    }
  }

}

export default CartService;
