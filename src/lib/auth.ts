import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // MUST return these values
        return { id: user.id, email: user.email };
      },
    }),
  ],

  // IMPORTANT: store user data inside JWT
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;     // Attach user.id to token
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;    // Expose user.id to session
        session.user.email = token.email;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const getSession = async () => {
  return await getServerSession(authOptions);
};
