import express from 'express';
import { Google } from './google.controller';
import { SignupController } from './signup.controller';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Authentication working...' });
});

/**
 *
 * Route : /signup with email and password
 *
 */
router.post('/signup', (req, res) => new SignupController(req, res).signup());
/**
 *
 * Route: /login with email and password
 *
 */
router.post('/login', (req, res) => new SignupController(req, res).login());
/**
 *
 * Route: /forgot-password
 *
 */
router.post('/forgot-password', (req, res) => new SignupController(req, res).forgotPassword());
/**
 *
 * Route: /reset-password
 *
 */
router.post('/reset-password', (req, res) => new SignupController(req, res).resetPassword());
/**
 *
 * Route: /google-signin
 *
 */
router.post('/google-signin', (req, res) => new Google(req, res).googleSignin());
/**
 *
 * Google signup
 */
router.post('/google-signup', (req, res) => new Google(req, res).googleSignup());
/**
 *
 *
 */
export default router;
