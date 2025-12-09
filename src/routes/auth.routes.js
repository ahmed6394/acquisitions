import express from 'express';
import { signup, signIn, signOut } from '#controllers/auth.controller.js';

const router = express.Router();

// route for user signup
router.post('/sign-up', signup);

// route for user signin
router.post('/sign-in', signIn);

// route for user signout
router.post('/sign-out', signOut);

export default router;