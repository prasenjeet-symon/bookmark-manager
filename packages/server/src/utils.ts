import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { Resend } from 'resend';
import { v4 } from 'uuid';
import { ApiEvent, ApiEventNames } from './events';
import { EmailOptions, LocationInfo } from './schema';

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

    // Enable subscription plan if already not created
    ApiEvent.getInstance().dispatch(ApiEventNames.ADMIN_PLAN_CREATION, {
        adminIdentifier: userId,
        adminEmail: email,
    });

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
    expiresIn: string | null = null,
    timeZone: string | null = null
): Promise<string> {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = expiresIn || process.env.JWT_EXPIRES_IN || '1d';

    if (!JWT_SECRET) {
        Logger.getInstance().logError('JWT_SECRET not set in the environment variables');
        throw new Error('JWT_SECRET not set');
    }

    return jwt.sign({ userId, email, isAdmin: isAdmin, timeZone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
/**
 *
 * Find JWT expiration date in UTC
 *
 */
export function getJwtExpirationDate(token: String) {
    const jwt = require('jsonwebtoken');
    const expirationSeconds = jwt.decode(token).exp;
    Logger.getInstance().logWarning(expirationSeconds);
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
export function isTokenActive(token: string): boolean {
    try {
        const jwt = require('jsonwebtoken');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '', {
            ignoreExpiration: false,
        });

        return true;
    } catch (error) {
        console.error(error);
        // An error occurred while decoding the token
        return false;
    }
}

/**
 *
 * Is input integer
 */
export function isInteger(value: any): boolean {
    return Number.isInteger(value);
}

/**
 *
 * Stripe price
 */
export function getStripePrice(price: any): number {
    return Math.round(getPrice(price) * 100);
}

/**
 *
 * Get price
 */
export function getPrice(price: any, defaultPrice: number = 100): number {
    return Math.round(+(price || defaultPrice));
}

/**
 *
 * Send email with resend
 */
export async function sendEmail(data: EmailOptions): Promise<string | undefined> {
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
    const API_KEY = process.env.RESEND_API_KEY || '';
    const resend = new Resend(API_KEY);

    try {
        const sendResult = await resend.emails.send({
            from: from,
            to: data.to,
            subject: data.subject,
            html: data.html || '',
        });

        if (sendResult.error) throw sendResult.error;
        return sendResult.data?.id;
    } catch (error: any) {
        Logger.getInstance().logError('Error sending email : ' + error);
        return undefined;
    }
}
/**
 *
 * Get timestamp
 */
export function getCurrentTimestampInSecondsUTC(): number {
    // Get the current timestamp in milliseconds using Date.now()
    const timestampInMilliseconds = Date.now();

    // Convert the timestamp to seconds
    const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000);

    return timestampInSeconds;
}
/**
 *
 * Get client ip address
 */
export function getClientIP(req: Request): string {
    // Check if the request is coming through a proxy
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor && typeof forwardedFor === 'string') {
        // Extract the client IP from the X-Forwarded-For header
        const ips = forwardedFor.split(',');
        return ips[0].trim();
    }

    // If not behind a proxy, simply use the remote address from the request
    return req.ip || '';
}

/**
 *
 * Get user agent
 */
export function getUserAgent(req: Request): string {
    return req.headers['user-agent'] || '';
}
/**
 * Get client location
 */
export async function getClientLocation(req: Request): Promise<LocationInfo | undefined> {
    const { IPINFO_TOKEN } = process.env;
    if (IPINFO_TOKEN === undefined) {
        Logger.getInstance().logError('IPINFO_TOKEN is not defined. Please set it in .env file');
        return;
    }

    const clientIP = getClientIP(req);
    console.log('Client IP: ' + clientIP);

    try {
        // Make a request to the ipinfo.io API to get location information
        const response = await axios.get<LocationInfo>(`https://ipinfo.io/${clientIP}?token=${IPINFO_TOKEN}`);
        return response.data;
    } catch (error) {
        Logger.getInstance().logError('Error getting client location : ' + error);
        return;
    }
}

/**
 *
 *
 */
export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
}
/**
 *
 *
 */
export function generateChecksum(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}

/**
 *
 *
 */
export function timestampToDate(timestampInSeconds: number): Date {
    // Multiply by 1000 to convert seconds to milliseconds
    const milliseconds = timestampInSeconds * 1000;
    return new Date(milliseconds);
}
/**
 *
 *
 * Date to timestamp
 */
export function dateToTimestampInSeconds(date: Date): number {
    // Get the time in milliseconds using getTime(), and then convert to seconds
    return Math.floor(date.getTime() / 1000);
}

/**
 *
 *
 *
 */
interface CurrencyFormat {
    currency: string;
    symbol: string;
}

const currencyFormats: { [key: string]: CurrencyFormat } = {
    usd: { currency: 'USD', symbol: '$' },
    inr: { currency: 'INR', symbol: '₹' },
};

export function formatPrice(currency: string, price: number): string {
    const currencyFormat = currencyFormats[currency.toLowerCase()];
    if (!currencyFormat) {
        throw new Error('Unsupported currency');
    }

    const formattedPrice = price / 100; // assuming price is in cent/paisa, converting to actual amount
    return `${currencyFormat.symbol}${formattedPrice.toFixed(2)}`; // assuming 2 decimal places for cents/paisa
}
