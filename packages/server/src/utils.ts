import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

/**
 *
 *
 * Logger
 */
export class Logger {
    private static instance: Logger;

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private logWithColor(message: string, color: string): void {
        console.log(`${color}%s\x1b[0m`, message);
    }

    public logWarning(message: string): void {
        this.logWithColor(`Warning: ${message}`, '\x1b[33m'); // Yellow
    }

    public logError(message: string): void {
        this.logWithColor(`Error: ${message}`, '\x1b[31m'); // Red
    }

    public logSuccess(message: string): void {
        this.logWithColor(`Success: ${message}`, '\x1b[32m'); // Green
    }
}
/**
 *
 *
 *
 *
 * Authenticate user
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'Internal server error' });
        Logger.getInstance().logError('JWT_SECRET is not defined in the environment variables');
        return;
    }

    const jwt = require('jsonwebtoken');
    // Get the authentication token from the request headers, query parameters, or cookies
    // Example: Bearer <token>
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.query.token;

    // Verify and decode the token
    try {
        // Verify the token using your secret key or public key
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Set the user ID and email and isAdmin in the response object
        res.locals.userId = decodedToken.userId;
        res.locals.email = decodedToken.email;
        res.locals.isAdmin = decodedToken.isAdmin;

        next();
    } catch (error) {
        // Token verification failed
        res.status(401).json({ error: 'Invalid token' });
        Logger.getInstance().logError('Invalid token');
        return;
    }
};
/**
 *
 *
 *
 * Hash password
 */
export const hashPassword = (password: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
};
/**
 *
 *
 *
 * Signup admin user
 */
export async function signUpAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!(email && password)) {
        Logger.getInstance().logError(
            'Admin email and password are required. please set ADMIN_EMAIL and ADMIN_PASSWORD in the environment variables'
        );
        throw new Error('Admin email and password are required. please set ADMIN_EMAIL and ADMIN_PASSWORD');
    }

    const userId = v4();
    const oldUser = await doAdminUserExit(email);
    if (oldUser) {
        Logger.getInstance().logError('Admin user already exists. please login');
        return;
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Save the user to the database or perform any desired actions
    const prisma = PrismaClientSingleton.prisma;
    await prisma.admin.create({
        data: {
            email: email,
            password: hashedPassword,
            fullName: process.env.ADMIN_NAME || '',
            userId: userId,
        },
    });

    // generate JSON Web Token
    const token = await createJwt(userId, email, true);
    return token;
}
/**
 *
 *
 * Do admin user exit
 */
export async function doAdminUserExit(email: string) {
    const prisma = PrismaClientSingleton.prisma;

    const user = await prisma.admin.findUnique({
        where: {
            email: email,
        },
    });

    return user;
}
/**
 *
 *
 *
 * Create JWT
 */
export async function createJwt(
    userId: string,
    email: string,
    isAdmin: boolean = false,
    expiresIn: string | null = null
): Promise<string> {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = expiresIn || process.env.JWT_EXPIRES_IN || '1d';

    if (!JWT_SECRET) {
        Logger.getInstance().logError('JWT_SECRET not set in the environment variables');
        throw new Error('JWT_SECRET not set');
    }

    return jwt.sign({ userId, email, isAdmin: isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
/**
 *
 * Find JWT expiration date in UTC
 *
 */
export function getJwtExpirationDate(token: String) {
    const jwt = require('jsonwebtoken');
    const tokenExpiration = process.env.JWT_EXPIRES_IN || '1d';
    const expirationSeconds = jwt.decode(tokenExpiration).exp;
    const tokenExpirationDateUTC = new Date(Date.now() + expirationSeconds * 1000);

    return tokenExpirationDateUTC;
}
/**
 *
 *
 * Prisma client
 */
export class PrismaClientSingleton {
    static #instance: PrismaClient;

    static get prisma() {
        if (!PrismaClientSingleton.#instance) {
            PrismaClientSingleton.#instance = new PrismaClient();
        }

        return PrismaClientSingleton.#instance;
    }
}
/**
 *
 * Email validator
 */
export function isValidEmail(email: string): boolean {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 *
 * Password validator
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
    // Password must be at least 8 characters long
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long.' };
    }

    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter.' };
    }

    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter.' };
    }

    // Password must contain at least one digit
    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must contain at least one digit.' };
    }

    // Password must contain at least one special character (e.g., !@#$%^&*)
    if (!/[!@#$%^&*]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*).' };
    }

    // If all checks pass, the password is considered valid
    return { valid: true };
}
/**
 *
 *
 * Is JWT expired
 */
export function isTokenExpired(token: string): boolean {
    try {
        const jwt = require('jsonwebtoken');
        const decodedToken: any = jwt.decode(token);

        if (!decodedToken || !decodedToken.exp) {
            // Token or expiration claim is missing
            return true;
        }

        // Convert expiration time from seconds to milliseconds (assuming it's already in UTC)
        const expirationTimeUTC = decodedToken.exp * 1000;

        // Get the current time in UTC
        const currentTimeUTC = new Date().getTime();

        // Check if the token has expired
        return currentTimeUTC > expirationTimeUTC;
    } catch (error) {
        // An error occurred while decoding the token
        return true;
    }
}

/**
 *
 * Is input integer
 */
export function isInteger(value: any): boolean {
    return Number.isInteger(value);
}
