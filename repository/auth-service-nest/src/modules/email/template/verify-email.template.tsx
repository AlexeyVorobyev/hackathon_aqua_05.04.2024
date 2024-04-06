import * as React from 'react'
import { CSSProperties, FC } from 'react'
import { Body, Button, Container, Head, Html, Preview, Text } from '@react-email/components'

interface IVerifyEmailTemplateProps {
    applicationAddress: string
    redirectSuccessAddress: string
    redirectFailureAddress: string
    username: string
    token: string
}

export const VerifyEmailTemplate: FC<IVerifyEmailTemplateProps> = ({
                                                                       applicationAddress,
                                                                       redirectSuccessAddress,
                                                                       redirectFailureAddress,
                                                                       username,
                                                                       token,
                                                                   }) => {
    return (
        <Html>
            <Head/>
            <Preview>Auth service email verification</Preview>
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Text style={{ margin: 'auto', textAlign: 'center' }}>Hello {username}!</Text>
                    <Text style={{ margin: 'auto', textAlign: 'center' }}>Click on below button to finish process of
                        verifying.</Text>
                    <Button style={buttonStyle}
                            href={`${applicationAddress}/auth/verify-callback?token=${token}&redirectSuccess=${redirectSuccessAddress}&redirectFailure=${redirectFailureAddress}`}>
                        <Text>Verify your account</Text>
                    </Button>
                </Container>
            </Body>
        </Html>
    )
}

const mainStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const containerStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    marginTop: '20px',
    maxWidth: '360px',
    margin: '0 auto',
    padding: '40px 0 40px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
}

const buttonStyle: CSSProperties = {
    padding: '5px 20px 0 20px',
    display: 'block',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '10px',
    position: 'relative',
    textAlign: 'center',
    margin: '10px auto 0 auto',
    width: 'calc(100% - 40px)',
}