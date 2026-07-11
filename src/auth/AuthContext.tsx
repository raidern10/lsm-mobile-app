import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { TOKEN_KEY, setUnauthorizedHandler } from "../api/client";
import { authApi } from "../api/services";

export type Role =
  | "admin"
  | "guru_pembimbing"
  | "siswa_pkl"
  | "instruktur_industri";
export type User = {
  id: number;
  name: string;
  email?: string;
  nisn?: string;
  nip?: string;
  role: Role;
  [k: string]: any;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) setUser(await authApi.me());
      } catch {
        await clearSession();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (login: string, password: string) => {
    const res = await authApi.login({ login, password, device: "mobile" });
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    await clearSession();
  };

  return (
    // PERBAIKAN: Membungkus value prop dengan kurung kurawal ganda {{ }}
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
