import { Body, Head, Heading, Html, render, renderAsync } from '@react-email/components';
import React from 'react';

export function MyEmail(props: { url: string }) {
    const { url } = props;

    return (
        <Html lang="en">
            <Head title="Hello World" />
            <Body>
                <Heading>Hello World!</Heading>
                <p>
                    Please click the link below to verify your email address:
                </p>
                <a href={url}>{url}</a>
            </Body>
        </Html>
    );
}

const renderTemplate = (url: string) => render(<MyEmail url={url} />);

export default renderTemplate;