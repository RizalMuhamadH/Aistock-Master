import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "@/app/(lib)/prisma-client"
import GoogleProvider from "next-auth/providers/google"
import { createGoogleUser } from "@/app/(db)/user";

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...config,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async session({ session }) {
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const user = await createGoogleUser(profile?.email!!, profile?.picture, profile?.name!!, profile?.id!!)
        return profile?.email!!
        // return profile?.email_verified && profile?.email?.endsWith("@example.com")
      }
      return true
    },
    jwt({ token, account, user }) {

      return token
    }
  },
  session: {
    strategy: "jwt"
  },
})
