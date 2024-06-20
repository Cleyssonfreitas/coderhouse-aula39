import { Router } from 'express';
import passport from "passport";

const router = Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signupfail'
}));

router.get('/signupfail', (req, res) => {
  res.send({ error: 'Falha no registro' });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/loginfail', (req, res) => {
  res.send({ error: 'Falha no login' });
});

router.post('/login', passport.authenticate('login', {
  failureRedirect: '/loginfail'
}), async (req, res) => {
  if (!req.user) return res.status(400).json({error: 'Credenciais invalidas'});
  req.session.user = {
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  }
  res.redirect('/products');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
