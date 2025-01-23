import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/router";

const registerFormSchema = z.object({
    username: z.string()
        .min(3, { message: "Mínimo de 3 caracteres" }) // MINIMO DE 3 CARACTERES
        .regex(/^([a-z||-]+)$/i, { message: "O nome do usuário só pode ter letras e hifens" }) // SÓ ACEITA LETRAS E -
        .transform(username => username.toLowerCase()),// TRANSFORMA DADOS PRA MIN,
    
        name: z.string().min(3, {message: "O nome precisa ter pelo menos 3 letras."})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {

    const { register, setValue, handleSubmit, formState: {isSubmitting, errors}} = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    })

    const router = useRouter()

    useEffect(() => {
        if(router.query.username){
            setValue('username', String(router.query.username))    
        }
    }, [router.query?.username, setValue])

    async function handleRegister(data: RegisterFormData)
    {
        console.log(data)
    }


    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Bem-vindo ao Ignite Call
                </Heading>
                <Text>
                Precisamos de algumas informações para criar seu perfil! 
                Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>

            <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size="sm">Nome de usuário</Text>
                    <TextInput prefix="ignite.com/" placeholder="seu-usuario" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} {...register("username")} ></TextInput>
                    {errors.username && (
                        <FormError size="sm">{errors.username.message}</FormError>
                    )}
                </label>

                <label>
                    <Text size="sm">Nome completo</Text>
                    <TextInput placeholder="Seu nome" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} {...register("name")} ></TextInput>
                    {errors.name && (
                        <FormError size="sm" >{errors.name.message}</FormError>
                    )}
                </label>

                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </Form>
        </Container>
    )
}