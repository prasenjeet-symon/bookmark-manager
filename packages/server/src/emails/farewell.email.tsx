import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

export function FarewellEmail(props: { user: any }) {
    const { user } = props;

    return (
        <Html lang="en">
            <Head title="Farewell and Thank You" />
            <Body>
                <Heading>Farewell and Thank You</Heading>
                <p>Dear {user.fullName},</p>
                <p>As you embark on new adventures, we want to express our sincere gratitude for being a part of the Bookmark Manager community.</p>
                <p>It has been a pleasure serving you, and we appreciate the trust you placed in our service. If you ever decide to return, know that you will always be welcome.</p>
                <p>Wishing you success and happiness in all your future endeavors. Thank you for being a valued member of our community.</p>
                <p>Farewell and best wishes,</p>
                <p>The Bookmark Manager Team</p>
            </Body>
        </Html>
    );
}

const renderFarewellEmail = (user: any) => render(<FarewellEmail user={user} />);

export default renderFarewellEmail;
