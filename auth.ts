import { ConvexAdapter } from "@/app/ConvexAdapter";
import NextAuth from "next-auth"  
import GoogleProvider from "next-auth/providers/google"
import { importPKCS8, SignJWT } from "jose";


if(process.env.CONVEX_AUTH_PRIVATE_KEY == undefined){
  throw new Error("CONVEX_AUTH_PRIVATE_KEY is not defined");
}

if(process.env.JWKS == undefined){
  throw new Error("JWKS is not defined");
}

if(process.env.NEXT_PUBLIC_CONVEX_URL == undefined){
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
}

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  ".cloud",
  ".site"
) || "";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    //google outh
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent"
        }
      }
    }),
  ],
  adapter: ConvexAdapter,
  callbacks:{
    async session({session}){
      const privateKey=await importPKCS8(process.env.CONVEX_AUTH_PRIVATE_KEY!, 
        'RS256');
        const convexToken = await new SignJWT({
          sub: session.userId
        }).setProtectedHeader({alg: 'RS256'})
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience('convex')
        .setExpirationTime('1h')
        .sign(privateKey);
      return {...session,convexToken}
    }
  }
});