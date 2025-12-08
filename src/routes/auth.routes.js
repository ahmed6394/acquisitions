import express from 'express';
import { signup } from '#controllers/auth.controller.js';

const router = express.Router();

// route for user signup
router.post('/sign-up', signup);

// route for user signin
router.post('/sign-in', (req, res) => {
  // const { username, password } = req.body;
  // Authentication logic here
  res.send('POST /api/auth/sign-in response');
});

// route for user signout
router.post('/sign-out', (req, res) => {
  // const { username, password } = req.body;
  // Authentication logic here
  res.send('POST /api/auth/sign-out response');
});

export default router;