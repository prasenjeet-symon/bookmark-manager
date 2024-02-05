import axios from 'axios';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ApiEvent, ApiEventNames } from '../events';
import { IGoogleAuthTokenResponse } from '../schema';
import {
    Logger,
    PrismaClientSingleton,
    createJwt,
    getClientIP,
    getClientLocation,
    getJwtExpirationDate,
    getUserAgent,
} from '../utils';

export class Google {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Sign in with google
     *
     */
    async googleSignin() {
        if (!this.validReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const token = this.req.body.token;
        const googleAuthTokenResponse = await this.verifyGoogleAuthToken(token);

        if (!googleAuthTokenResponse) {
            this.res.status(400).json({ error: 'Invalid token' });
            Logger.getInstance().logError('Invalid token');
            return;
        }

        // Check if the user already exit or not with given email and userId
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findFirst({
            where: {
                email: googleAuthTokenResponse.email,
                userId: googleAuthTokenResponse.userId,
            },
        });

        if (!user) {
            this.res.status(400).json({ error: 'User not found' }); 
            Logger.getInstance().logError('User not found');
            return;
        }

        // User do exit , create jwt token
        const ipLocation = await getClientLocation(this.req);
        const tokenJwt = await createJwt(user.userId, user.email, false, null, ipLocation?.timezone || null);

        // Add session
        await prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: {
                sessions: {
                    upsert: {
                        where: { sessionToken: tokenJwt },
                        create: {
                            sessionToken: tokenJwt,
                            expires: getJwtExpirationDate(tokenJwt),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                        update: {
                            expires: getJwtExpirationDate(tokenJwt),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                    },
                },
            },
        });

        this.res.status(200).json({
            token: tokenJwt,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            timeZone: user.timeZone,
        });

        Logger.getInstance().logSuccess('User signed in successfully');
        return;
    }
    /**
     *
     * Google signup
     */
    async googleSignup() {
        if (!this.validReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const token = this.req.body.token;

        const googleAuthTokenResponse = await this.verifyGoogleAuthToken(token);
        if (!googleAuthTokenResponse) {
            this.res.status(400).json({ error: 'Invalid token' });
            Logger.getInstance().logError('Invalid token');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findFirst({
            where: {
                email: googleAuthTokenResponse.email,
                userId: googleAuthTokenResponse.userId,
            },
        });

        if (user) {
            this.res.status(400).json({ error: 'User already exists' });
            Logger.getInstance().logError('User already exists');
            return;
        }

        const ipLocation = await getClientLocation(this.req);

        const newUser = await prisma.user.create({
            data: {
                email: googleAuthTokenResponse.email,
                userId: googleAuthTokenResponse.userId,
                fullName: googleAuthTokenResponse.name,
                timeZone: ipLocation?.timezone || '',
                password: v4(),
                userSetting: {
                    create: {
                        numberOfColumns: 'THREE',
                    }
                }
            },
            select: {
                userId: true,
                email: true,
                fullName: true,
                timeZone: true,
            },
        });

        const tokenJwt = await createJwt(newUser.userId, newUser.email, false, null, ipLocation?.timezone || null);

        // Add session
        await prisma.user.update({
            where: {
                userId: newUser.userId,
            },
            data: {
                sessions: {
                    upsert: {
                        where: { sessionToken: tokenJwt },
                        create: {
                            sessionToken: tokenJwt,
                            expires: getJwtExpirationDate(tokenJwt),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                        update: {
                            expires: getJwtExpirationDate(tokenJwt),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                    },
                },
            },
        });

        this.res.status(200).json({
            token: tokenJwt,
            userId: newUser.userId,
            email: newUser.email,
            fullName: newUser.fullName,
            timeZone: ipLocation?.timezone || '',
        });

        Logger.getInstance().logSuccess('User created');
        ApiEvent.getInstance().dispatch(ApiEventNames.USER_CREATED, {
            userId: newUser.userId,
            email: newUser.email,
        });

        return;
    }
    /**
     *
     * Validate request body of google sign in
     *
     */
    validReqBody(): boolean {
        // We need token only
        const { token } = this.req.body;

        if (token === undefined) {
            this.res.status(400).json({ error: 'token is required' });
            Logger.getInstance().logError('token is required');
            return false;
        }

        if (!token) {
            this.res.status(400).json({ error: 'token is required' });
            Logger.getInstance().logError('token is required');
            return false;
        }

        return true;
    }
    /**
     *
     * Verify google auth token
     *
     */
    async verifyGoogleAuthToken(token: string): Promise<IGoogleAuthTokenResponse | null> {
        try {
            const [tokenInfoResponse, userInfoResponse] = await Promise.all([
                axios.get('https://oauth2.googleapis.com/tokeninfo', {
                    params: {
                        access_token: token,
                    },
                }),
                axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            const payload = tokenInfoResponse.data;
            const userId = payload.sub;
            const email = payload.email;
            const userProfile = userInfoResponse.data;
            const name = userProfile.name;
            const picture = userProfile.picture;

            return { success: true, userId, email, name, profile: picture };
        } catch (error: any) {
            Logger.getInstance().logError(error);
            return null;
        }
    }
}
