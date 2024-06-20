import {Router} from "express";
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
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

router.post('/', async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json({message: "Carrinho adicionado.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartController.getCart(req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await cartController.updateCart(req.params.cid, req.body);
    res.status(200).json({message: "Carrinho atualizado.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.addProductToCart(req.params.cid, {product: req.params.pid, quantity: quantity ?? 1});
    res.status(200).json({message: "Produto adicionado ao carrinho.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.setProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).json({message: "Quantidade de produto atualizada.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    await cartController.removeProductsFromCart(req.params.cid);
    res.status(204).send();
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
