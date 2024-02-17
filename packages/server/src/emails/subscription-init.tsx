import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

interface SubscriptionActivatedEmailProps {
    user: any;
    platformName: string;
    platformURL: string;
    subscriptionType: string;
    subscriptionCost: string;
}

export function SubscriptionActivatedEmail({
    user,
    platformName,
    platformURL,
    subscriptionType,
    subscriptionCost,
}: SubscriptionActivatedEmailProps) {
    return (
        <Html lang="en">
            <Head title={`Your ${subscriptionType} Subscription on ${platformName} is Activated`} />
            <Body>
                <Heading>{subscriptionType} Subscription Activated</Heading>
                <p>Dear {user.fullName},</p>
                <p>
                    We're thrilled to inform you that your {subscriptionType.toLowerCase()} subscription on{' '}
                    {platformName} has been successfully activated!
                </p>
                <p>
                    You now have access to all the premium features and benefits that come with your subscription plan.
                </p>
                <p>
                    Your chosen subscription plan costs {subscriptionCost} per month and offers a comprehensive suite of
                    tools to enhance your {platformName.toLowerCase()} experience.
                </p>
                <p>
                    Feel free to explore the platform and make the most out of your subscription. If you have any
                    questions or need assistance, our support team is here to help.
                </p>
                <p>
                    To get started, simply visit our website: <a href={platformURL}>{platformURL}</a>
                </p>
                <p>
                    Thank you for choosing {platformName} for your {platformName.toLowerCase()} needs. We're excited to
                    have you as a valued subscriber!
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

const renderSubscriptionActivatedEmail = (
    user: any,
    platformName: string,
    platformURL: string,
    subscriptionType: string,
    subscriptionCost: string
) =>
    render(
        <SubscriptionActivatedEmail
            user={user}
            platformName={platformName}
            platformURL={platformURL}
            subscriptionType={subscriptionType}
            subscriptionCost={subscriptionCost}
        />
    );

export default renderSubscriptionActivatedEmail;
