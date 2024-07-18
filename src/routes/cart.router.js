import { Router } from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import CartController from "../controllers/cart.controller.js";
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import CartServiceFs from "../dao/services/filesystem/cart.service.js";
import CartServiceDb from "../dao/services/db/cart.service.js";
import cartModel from "../dao/models/cart.model.js";

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const cartService = process.env.PERSIST_MODE === 'filesystem'
  ? new CartServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/carts.json')))
  : new CartServiceDb(cartModel);
const cartController = new CartController(cartService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do carrinho
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: O ID do produto
 *               quantity:
 *                 type: integer
 *                 description: A quantidade do produto
 *       required:
 *         - id
 *         - items
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Adiciona um novo carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Carrinho adicionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Erro ao adicionar carrinho
 */
router.post('/', async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json({ message: "Carrinho adicionado.", payload: cart });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /cart/{cid}:
 *   get:
 *     summary: Retorna o carrinho pelo ID
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do carrinho
 *     responses:
 *       200:
 *         description: Detalhes do carrinho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrinho não encontrado
 */
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartController.getCart(req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /cart/{cid}:
 *   put:
 *     summary: Atualiza o carrinho pelo ID
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Carrinho atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrinho não encontrado
 */
router.put('/:cid', async (req, res) => {
  try {
    const cart = await cartController.updateCart(req.params.cid, req.body);
    res.status(200).json({ message: "Carrinho atualizado.", payload: cart });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do carrinho
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
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto adicionado ao carrinho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrinho ou produto não encontrado
 */
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartController.addProductToCart(req.params.cid, { product: req.params.pid, quantity: quantity ?? 1 });
    res.status(200).json({ message: "Produto adicionado ao carrinho.", payload: cart });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   put:
 *     summary: Atualiza a quantidade de um produto no carrinho
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do carrinho
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
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantidade de produto atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Carrinho ou produto não encontrado
 */
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartController.setProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).json({ message: "Quantidade de produto atualizada.", payload: cart });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

/**
 * @swagger
 * /cart/{cid}:
 *   delete:
 *     summary: Remove todos os produtos do carrinho
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do carrinho
 *     responses:
 *       204:
 *         description: Produtos removidos do carrinho
 *       404:
 *         description: Carrinho não encontrado
 */
router.delete('/:cid', async (req, res) => {
  try {
    await cartController.removeProductsFromCart(req.params.cid);
    res.status(204).send();
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

export default router;