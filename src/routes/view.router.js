import {Router} from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import CartController from "../controllers/cart.controller.js";
import CartServiceFs from "../dao/services/filesystem/cart.service.js";
import CartServiceDb from "../dao/services/db/cart.service.js";
import productModel from "../dao/models/product.model.js";
import chatService from "../lib/services/chat.service.js";
import {handleProductQueries} from "../lib/util.js";
import cartModel from "../dao/models/cart.model.js";
import {checkAuth} from "../middleware/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const productService = process.env.PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/products.json')))
  : new ProductServiceDb(productModel);
const productController = new ProductController(productService);

const cartService = process.env.PERSIST_MODE === 'filesystem'
  ? new CartServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/carts.json')))
  : new CartServiceDb(cartModel);
const cartController = new CartController(cartService);

const router = Router();

// The two variables below are used to prevent attaching the same listeners multiple times
let realTimeProductsListenersAttached = false;
let chatListenersAttached = false;

router.get('/', async (req, res) => {
  res.render('home', {title: 'Coderhouse Backend'});
});

router.get('/products', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  const result = await productController.getProducts(options);
  const products = result.payload;
  res.render('products', {title: 'Produtos', user: req.session.user, noProducts: products.length === 0, products, page: result.page, prevLink: result.prevLink, nextLink: result.nextLink});
});

router.get('/carts/:cid', checkAuth, async (req, res) => {
  const cart = await cartController.getCart(req.params.cid);
  res.render('cart', {title: 'Carrinho', user: req.session.user, noProducts: cart.products.length === 0, products: cart.products});
});

router.get('/realtimeproducts', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  if (!realTimeProductsListenersAttached) {
    req.io.on('connection', async (socket) => {
      req.io.to(socket.id).emit('products', (await productController.getProducts(options)).payload);
    });
    realTimeProductsListenersAttached = true;
  }
  res.render('realTimeProducts', {title: 'Produtos em tempo real', user: req.session.user});
});

router.get('/chat', (req, res) => {
  if (!chatListenersAttached) {
    chatService.attachListeners(req.io);
    chatListenersAttached = true;
  }
  res.render('chat', {title: 'chat'});
});

router.post('/chat/usercheck', (req, res) => {
  const { username } = req.body;
  const userCheck = chatService.userCheck(username);
  res.status(userCheck.status).send();
});

export default router;
