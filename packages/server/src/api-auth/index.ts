import express from 'express';
import { SignupController } from './signup.controller';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Authentication working...' });
});

/**
 * Route : /signup with email and password
 */
router.post('/signup', (req, res) => new SignupController(req, res).signup());

export default router;
