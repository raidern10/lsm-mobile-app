import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
}

export default function TextField({ label, ...props }: TextFieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
          color: "#374151",
        }}
      >
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: "#ffffff",
          fontSize: 16,
          color: "#111827",
        }}
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
}
