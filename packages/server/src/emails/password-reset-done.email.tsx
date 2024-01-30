import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

export function PasswordResetSuccessEmail(props: { user: any }) {
    const { user } = props;

    return (
        <Html lang="en">
            <Head title="Password Reset Successful" />
            <Body>
                <Heading>Password Reset Successful</Heading>
                <p>Dear {user.name},</p>
                <p>Your password has been successfully reset for your account at Bookmark Manager.</p>
                <p>If you have any further questions or concerns, please feel free to contact our support team.</p>
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

const renderPasswordResetSuccessEmail = (user: any) => render(<PasswordResetSuccessEmail user={user} />);

export default renderPasswordResetSuccessEmail;
