import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { ArrowRight, Check } from "phosphor-react";
//import { api } from "@/lib/axios";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function ConnectCalendar() {
    const session = useSession()
    const router = useRouter()

    const hasAuthError = !!router.query.error
    const isSignedIn = session.status === 'authenticated'

    async function handleConnectCalendar() {
        await signIn('google', { callbackUrl: '/register/connect-calendar'} )
    }
    
    async function handleNavigateToNextStep() {
        await router.push("/register/time-intervals")
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Conecte sua agenda!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil!
                    Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={2} />
            </Header>



            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calendar</Text>
                    {
                        isSignedIn

                            ?

                            <Button size="sm" disabled >
                                Conectado
                                <Check />
                            </Button>

                            :

                            <Button variant="secondary" size="sm" onClick={handleConnectCalendar} >
                                Conectar
                                <ArrowRight />
                            </Button>
                    }

                </ConnectItem>

                {hasAuthError
                    && (
                        <AuthError size="sm">
                            Falha ao se conectar ao Google, verifique se você habilitou as permissões de
                            acesso ao Google Calendar.
                        </AuthError>
                    )}

                <Button type="submit" disabled={!isSignedIn} onClick={handleNavigateToNextStep}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </ConnectBox>

        </Container>
    )
}