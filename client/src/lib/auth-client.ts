import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.SERVER_BASE_URL,

});

export const {
    signIn,
    signOut,
    useSession,
} = authClient;