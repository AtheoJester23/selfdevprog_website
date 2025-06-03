declare module "next-auth"{
    interface Session{
        id: string
        user: {
            name?: string | null,
            email?: string | null,
            image?: string | null
        }
    }

    interface JWT{
        id: string
    }
}