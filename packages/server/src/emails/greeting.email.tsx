import { Body, Head, Heading, Html, render } from '@react-email/components';
import React from 'react';

export function MyEmail(props: { user: any }) {
    const { user } = props;

    return (
        <Html lang="en">
            <Head title="Hello World" />
            <Body>
                <Heading>Greeting from bookmark manager!</Heading>
                <p>Hello, {user.name} welcome to bookmark manager </p>
            </Body>
        </Html>
    );
}

const renderTemplate = (user: any) => render(<MyEmail user={user} />);

export default renderTemplate;
