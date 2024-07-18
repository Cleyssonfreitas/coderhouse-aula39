import { Router } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import productModel from "../dao/models/product.model.js";
import { handleProductQueries } from "../lib/util.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const productService = process.env.PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/products.json')))
  : new ProductServiceDb(productModel);
const productController = new ProductController(productService);

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do produto
 *         name:
 *           type: string
 *           description: O nome do produto
 *         price:
 *           type: number
 *           description: O preço do produto
 *         stock:
 *           type: integer
 *           description: A quantidade em estoque
 *       required:
 *         - id
 *         - name
 *         - price
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Consulta de produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
  try {
    const options = handleProductQueries(req.query);
    const result = await productController.getProducts(options);
    res.json(result);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:pid', async (req, res) => {
  try {
    const product = await productController.getProduct(req.params.pid);
    res.json(product);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Adiciona um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Erro ao criar produto
 */
router.post('/', async (req, res) => {
  try {
    const product = await productController.addProduct(req.body);
    req.io.emit('products', await productController.getProducts());
    res.status(201).json({ message: 'Produto criado', payload: product });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /products/{pid}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:pid', async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.pid, req.body);
    req.io.emit('products', await productController.getProducts());
    res.status(200).json({ message: 'Produto atualizado', payload: product });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /products/{pid}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do produto
 *     responses:
 *       204:
 *         description: Produto excluído
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:pid', async (req, res) => {
  try {
    await productController.deleteProduct(req.params.pid);
    req.io.emit('products', await productController.getProducts());
    res.status(204).json({ message: 'Produto excluído' });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

export default router;
