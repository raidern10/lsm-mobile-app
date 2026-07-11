import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../src/auth/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signIn({ email, password });
    router.replace("/(app)/dashboard");
  };

  return (
    // PERBAIKAN: Semua style menggunakan {{ ... }}
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Login LSM Mobile
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 14,
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 14,
            borderRadius: 8,
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "#2563eb",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}>
            Masuk
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
