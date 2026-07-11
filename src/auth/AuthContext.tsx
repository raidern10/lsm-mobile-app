import React, { createContext, useState, useContext, useEffect } from 'react';

// Sesuaikan tipe data dengan kebutuhan aplikasi Anda
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (data: any) => {
    // Logika login Anda
    setUser(data);
  };

  const signOut = async () => {
    // Logika logout Anda
    setUser(null);
  };

  return (
    // PERBAIKAN: Menggunakan kurung kurawal ganda {{ }}
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);