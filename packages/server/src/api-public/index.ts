import express from 'express';
import HTML from '../emails/greeting.email';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Hello World from Public' });
});

router.get('/hello', (_req, res) => {
    res.send({ message: 'Hello World from Public' });
});

export default router;
