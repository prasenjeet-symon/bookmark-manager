import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

interface FreeTrialInitiatedEmailProps {
    user: any;
    platformName: string;
    platformURL: string;
    trialDays: number;
}

export function FreeTrialInitiatedEmail({ user, platformName, platformURL, trialDays }: FreeTrialInitiatedEmailProps) {
    return (
        <Html lang="en">
            <Head title={`Start Your ${trialDays}-Day Free Trial on ${platformName}`} />
            <Body>
                <Heading>{platformName} Free Trial Initiated</Heading>
                <p>Dear {user.fullName},</p>
                <p>
                    We're excited to inform you that your {trialDays}-day free trial on {platformName} has been
                    successfully initiated!
                </p>
                <p>
                    During this trial period, you'll have full access to all the features and functionalities of{' '}
                    {platformName}. We hope you make the most out of it.
                </p>
                <p>
                    Feel free to explore the platform and its offerings. If you have any questions or need assistance,
                    our support team is always available to help.
                </p>
                <p>
                    To get started, simply visit our website: <a href={platformURL}>{platformURL}</a>
                </p>
                <p>
                    Thank you for choosing {platformName} for your {platformName.toLowerCase()} needs. We're thrilled to
                    have you onboard!
                </p>
                <p>
                    Best Regards,
                    <br />
                    The {platformName} Team
                </p>
            </Body>
        </Html>
    );
}

const renderFreeTrialInitiatedEmail = (user: any, platformName: string, platformURL: string, trialDays: number) =>
    render(
        <FreeTrialInitiatedEmail
            user={user}
            platformName={platformName}
            platformURL={platformURL}
            trialDays={trialDays}
        />
    );

export default renderFreeTrialInitiatedEmail;
