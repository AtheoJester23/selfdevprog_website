import NextAuth from "next-auth"
import Google from "next-auth/providers/google" 
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({profile}){
      if(!profile) return false;

      const {sub: id, name, email, picture: image} = profile

      const existingUser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
        id, 
      })

      if(!existingUser){
        await writeClient.createIfNotExists({
          _id: id!,
          id,
          _type: "user",
          name,
          email,
          image,
          username: "",
          quote: "",
        })
      }

      return true
    },

    async jwt({token, account, profile}){
      if(account && profile){
        const authorId = profile.sub
        const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
          id: authorId
        })

        token.id = user?.id;
      }
      return token;
    },

    async session({session, token}){
      Object.assign(session, {id: token.id})
      return session;
    }
  }
})