export interface IGoogleAuthTokenResponse {
    userId: string;
    email: string;
    name: string;
    profile: string;
    success: boolean;
}

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
