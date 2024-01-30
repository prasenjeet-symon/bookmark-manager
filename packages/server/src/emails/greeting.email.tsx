import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

export function WelcomeEmail(props: { user: any, platformName: string, platformURL: string }) {
    const { user, platformName, platformURL } = props;

    return (
        <Html lang="en">
            <Head title={`Welcome to ${platformName}`} />
            <Body>
                <Heading>Welcome to {platformName}!</Heading>
                <p>Dear {user.name},</p>
                <p>We are thrilled to welcome you to {platformName}! Your presence means a lot to us.</p>
                <p>{platformName} is a {platformName.toLowerCase()} platform designed to help you {platformName.toLowerCase()} efficiently.</p>
                <p>Feel free to explore the features and make the most out of your experience. If you have any questions, our support team is here to help.</p>
                <p>Get started by visiting our website: <a href={platformURL}>{platformURL}</a></p>
                <p>Thank you for joining us on this exciting journey!</p>
                <p>Best regards,<br />The {platformName} Team</p>
            </Body>
        </Html>
    );
}

const renderWelcomeEmail = (user: any, platformName: string, platformURL: string) =>
    render(<WelcomeEmail user={user} platformName={platformName} platformURL={platformURL} />);

export default renderWelcomeEmail;
