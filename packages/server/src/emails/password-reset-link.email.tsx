import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

export function PasswordResetEmail(props: { user: any; link: string }) {
    const { user, link } = props;

    return (
        <Html lang="en">
            <Head title="Password Reset Request" />
            <Body>
                <Heading>Password Reset Request</Heading>
                <p>Dear {user.name},</p>
                <p>We received a request to reset your password for your account at Bookmark Manager.</p>
                <p>Please click the following link to reset your password:</p>
                <p>
                    <a href={link}>{link}</a>
                </p>
                <p>If you did not initiate this request, you can safely ignore this email.</p>
                <p>Thank you for using Bookmark Manager!</p>
                <p>
                    Best regards,
                    <br />
                    The Bookmark Manager Team
                </p>
            </Body>
        </Html>
    );
}

const renderPasswordResetEmail = (user: any, link: string) => render(<PasswordResetEmail user={user} link={link} />);

export default renderPasswordResetEmail;
