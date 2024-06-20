import {describe, it, expect, beforeEach, vi} from "vitest";
import ProductService from "./product.service.js";

describe('ProductService', () => {
  let productService;
  let persistenceMock;
  let sampleProduct;
  let sampleProducts;

  beforeEach(() => {
    persistenceMock = {
      readItems: vi.fn(),
      saveItems: vi.fn()
    };
    productService = new ProductService(persistenceMock);
    sampleProduct = {id: 1, title: 'Product 1', price: 10, description: 'Description', code: 'P1', status: true, stock: 10, category: 'Category', thumbnails: []};
    sampleProducts = [
      {id: 1, title: 'Product 1', price: 10, description: 'Description', code: 'P1', status: true, stock: 10, category: 'Category', thumbnails: []},
      {id: 2, title: 'Product 2', price: 20, description: 'Description', code: 'P2', status: true, stock: 20, category: 'Category', thumbnails: []}
    ];
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      const result = await productService.getProducts({limit: 10});
      expect(result).toEqual(sampleProducts);
    });

    it('should return a limited list of products', async () => {
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      const result = await productService.getProducts({limit: 1});
      expect(result).toEqual([sampleProducts[0]]);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      const result = await productService.getProductById(1);
      expect(result).toEqual(sampleProduct);
    });

    it('should throw an error when product is not found', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await expect(productService.getProductById(1)).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('addProduct', () => {
    it('should add a product', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await productService.addProduct(sampleProduct);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([sampleProduct]);
    });

    it('should increment id', async () => {
      const product = {
        title: 'Product 3',
        price: 10,
        description: 'Description',
        code: 'P3',
        status: true,
        stock: 10,
        category: 'Category'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await productService.addProduct(product);
      await expect(productService.getProductById(3)).resolves.toEqual({...product, id: 3, thumbnails: []});
    });
    it('should throw an error when product is invalid', async () => {
      const product = {
        title: '',
        price: 10,
        description: 'Description',
        code: 'P3',
        status: true,
        stock: 10,
        category: 'Category'
      };
      await expect(productService.addProduct(product)).rejects.toThrow('Produto inválido.');
    });
    it('should throw an error when code already exists', async () => {
      const product = {
        title: 'Product 3',
        price: 10,
        description: 'Description',
        code: 'P1',
        status: true,
        stock: 10,
        category: 'Category'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await expect(productService.addProduct(product)).rejects.toThrow('Código já existe.');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const product = {
        title: 'updated Product 1',
      };
      persistenceMock.readItems.mockResolvedValue([sampleProduct]);
      await productService.updateProduct(1, product);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{...sampleProduct, ...product}]);
    });
    it('should throw an error when code already exists', async () => {
      const product = {
        code: 'P2'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await expect(productService.updateProduct(1, product)).rejects.toThrow('Código já existe.');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      persistenceMock.readItems.mockResolvedValue([sampleProduct]);
      await productService.deleteProduct(1);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([]);
    });

    it('should throw an error when product is not found', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await expect(productService.deleteProduct(1)).rejects.toThrow('Produto não encontrado.');
    });
  });

});
