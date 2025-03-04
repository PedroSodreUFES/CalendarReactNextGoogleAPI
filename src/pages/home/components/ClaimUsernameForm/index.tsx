import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

// validação do form de string
const claimUsernameFormSchema = z.object({
    username: z.string()
        .min(3, { message: "Mínimo de 3 caracteres" }) // MINIMO DE 3 CARACTERES
        .regex(/^([a-z||-]+)$/i, { message: "O nome do usuário só pode ter letras e hifens" }) // SÓ ACEITA LETRAS E -
        .transform(username => username.toLowerCase())// TRANSFORMA DADOS PRA MIN,
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    const router = useRouter()

    async function handleClaimUsername(data: ClaimUsernameFormData) {
        const { username }= data

        await router.push(`/register?username=${username}`)
    }

    return (
        <>
            <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
                <TextInput
                    size="sm"
                    prefix="ignite.com/"
                    placeholder="seu-usuario"
                    crossOrigin=""
                    onPointerEnterCapture=''
                    onPointerLeaveCapture=''
                    {...register('username')}
                />
                <Button size="sm" type="submit" disabled={isSubmitting}>
                    Reservar usuário
                    <ArrowRight />
                </Button>
            </Form>

            <FormAnnotation>
                <Text size="sm" >
                    {errors.username
                        ? errors.username.message
                        : "Digite o nome do usuário desejado"}
                </Text>
            </FormAnnotation>
        </>
    )
}