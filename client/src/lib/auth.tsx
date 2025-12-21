import { createContext, useContext, type ReactNode } from "react";
import { useSession, signIn, signOut } from "./auth-client";
import type { NewUser, NewSession } from "shared";

export interface AuthState {
    isAuthenticated: boolean;
    user: NewUser | null;
    session: NewSession | null;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data, isPending } = useSession();

    // Show loading state while checking auth - this prevents the router
    // from making auth decisions before we know the auth state
    if (isPending) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                Loading...
            </div>
        );
    }

    const value: AuthState = {
        isAuthenticated: !!data?.user,
        user: data?.user ?? null,
        session: data?.session ?? null,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export const signInWithGoogle = (callbackURL: string = "/dashboard") => {
    signIn.social({
        provider: "google",
        callbackURL: `${import.meta.env.VITE_CLIENT_BASE_URL}${callbackURL}`,
    });
};

export const signOutUser = async () => {
    await signOut();
    window.location.href = "/";
};