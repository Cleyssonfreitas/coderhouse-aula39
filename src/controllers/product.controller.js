class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getProducts = async (options) => {
    try {
      return await this.productService.getProducts(options);
    } catch (e) {
      throw e;
    }
  };

  addProduct = async (product) => {
    try {
      return await this.productService.addProduct(product);
    } catch (e) {
      throw e;
    }
  };

  getProduct = async (id) => {
    try {
      return await this.productService.getProductById(id);
    } catch (e) {
      throw e;
    }
  };

  updateProduct = async (id, product) => {
    try {
      return await this.productService.updateProduct(id, product);
    } catch (e) {
      throw e;
    }
  };

  deleteProduct = async (id) => {
    try {
      await this.productService.deleteProduct(id);
    } catch (e) {
      throw e;
    }
  };
}

export default ProductController;
