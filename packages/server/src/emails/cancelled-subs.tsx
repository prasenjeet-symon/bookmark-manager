import React from 'react';
import { Body, Head, Heading, Html, render } from '@react-email/components';

interface SubscriptionCancelledEmailProps {
    user: any;
    platformName: string;
}

export function SubscriptionCancelledEmail({ user, platformName }: SubscriptionCancelledEmailProps) {
    return (
        <Html lang="en">
            <Head title={`Your Subscription on ${platformName} has been Cancelled`} />
            <Body>
                <Heading>Subscription Cancelled</Heading>
                <p>Dear {user.fullName},</p>
                <p>We're sorry to inform you that your subscription on {platformName} has been cancelled.</p>
                <p>If you have any feedback or need assistance, please don't hesitate to reach out to our support team.</p>
                <p>Thank you for being a part of {platformName}. We hope to see you back soon!</p>
                <p>Best Regards,<br />The {platformName} Team</p>
            </Body>
        </Html>
    );
}

const renderSubscriptionCancelledEmail = (user: any, platformName: string) =>
    render(<SubscriptionCancelledEmail user={user} platformName={platformName} />);

export default renderSubscriptionCancelledEmail;
