import { GetStaticPaths, GetStaticProps } from "next";
import { UserHeader, Container } from "./styles";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { prisma } from "@/lib/prisma";
import { ScheduleForm } from "./ScheduleForm";

interface ScheduleProps {
    user: {
        name: string;
        bio: string;
        avatarUrl: string;
    }
}

export default function Schedule({user}: ScheduleProps){
    return (
        <Container>
            <UserHeader>
                <Avatar src={user.avatarUrl} alt="" />
                <Heading>{user.name}</Heading>
                <Text>{user.bio}</Text>
            </UserHeader>

            <ScheduleForm />
        </Container>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    return {
        paths: [], // só vai gerar a página caso um usuário pedir por ela
        fallback: 'blocking',
    }
}

export const getStaticProps : GetStaticProps = async ({ params }) => {
    const username = String(params?.username)

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    })

    if(!user){
        return {
            notFound: true,
        }
    }



    return {
        props: {
            user: {
                name: user.name,
                bio: user.bio,
                avatarUrl: user.avatar_url,
            },
        },
        revalidate: 60*60, // atualiza uma vez a cada 1 hora
    }
}