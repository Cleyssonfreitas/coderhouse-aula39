import { Router } from 'express';
import passport from "passport";

const router = Router();

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Página de cadastro
 *     responses:
 *       200:
 *         description: Página de cadastro
 */
router.get('/signup', (req, res) => {
  res.render('signup');
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Cadastro de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redireciona para a página de login
 *       400:
 *         description: Falha no registro
 */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signupfail'
}));

/**
 * @swagger
 * /signupfail:
 *   get:
 *     summary: Falha no cadastro
 *     responses:
 *       200:
 *         description: Falha no cadastro
 */
router.get('/signupfail', (req, res) => {
  res.send({ error: 'Falha no registro' });
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Página de login
 *     responses:
 *       200:
 *         description: Página de login
 */
router.get('/login', (req, res) => {
  res.render('login');
});

/**
 * @swagger
 * /loginfail:
 *   get:
 *     summary: Falha no login
 *     responses:
 *       200:
 *         description: Falha no login
 */
router.get('/loginfail', (req, res) => {
  res.send({ error: 'Falha no login' });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticação de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redireciona para a página de produtos
 *       400:
 *         description: Credenciais inválidas
 */
router.post('/login', passport.authenticate('login', {
  failureRedirect: '/loginfail'
}), async (req, res) => {
  if (!req.user) return res.status(400).json({ error: 'Credenciais invalidas' });
  req.session.user = {
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  }
  res.redirect('/products');
});

/**
 * @swagger
 * /github:
 *   get:
 *     summary: Autenticação com GitHub
 *     responses:
 *       302:
 *         description: Redireciona para o GitHub
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /githubcallback:
 *   get:
 *     summary: Callback da autenticação com GitHub
 *     responses:
 *       302:
 *         description: Redireciona para a página de produtos
 */
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout do usuário
 *     responses:
 *       302:
 *         description: Redireciona para a página de login
 */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;

