class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  getCart = async (id) => {
    try {
      return await this.cartService.getCartById(id);
    } catch (e) {
      throw e;
    }
  };

  addCart = async (cart) => {
    try {
      return await this.cartService.addCart(cart);
    } catch (e) {
      throw e;
    }
  };

  updateCart = async (id, cart) => {
    try {
      return await this.cartService.updateCart(id, cart);
    } catch (e) {
      throw e;
    }
  }

  addProductToCart = async (id, product) => {
    try {
      return await this.cartService.addProductToCart(id, product);
    } catch (e) {
      throw e;
    }
  };

  setProductQuantity = async (id, pid, quantity) => {
    try {
      return await this.cartService.setProductQuantity(id, pid, quantity);
    } catch (e) {
      throw e;
    }
  };

  removeProductsFromCart = async (id) => {
    try {
      return await this.cartService.removeProductsFromCart(id);
    } catch (e) {
      throw e;
    }
  };
}

export default CartController;
