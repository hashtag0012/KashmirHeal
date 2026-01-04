import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.isOnboarded = user.isOnboarded;
                token.phone = user.phone;
            }

            // Refetch role from DB to handle admin approvals without forcing re-login
            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id },
                    select: { role: true, isOnboarded: true, phone: true }
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.isOnboarded = dbUser.isOnboarded;
                    token.phone = dbUser.phone;
                }
            }

            // Handle manual session updates (trigger from client)
            if (trigger === "update" && session) {
                if (session.isOnboarded !== undefined) token.isOnboarded = session.isOnboarded;
                if (session.role !== undefined) token.role = session.role;
                if (session.phone !== undefined) token.phone = session.phone;
            }

            // Always enforce Admin overrides in token for specific emails
            const userEmail = token.email || user?.email;
            if (userEmail === "dr.hashim.official@gmail.com" ||
                userEmail === "hashimadil001@gmail.com" ||
                userEmail === "hashimadil001@gmai.com") {
                token.role = "ADMIN";
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.isOnboarded = token.isOnboarded;
                // @ts-ignore
                session.user.phone = token.phone;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
