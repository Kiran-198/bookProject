import React, { createContext, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000); // auto hide after 2s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25
  },
  toastText: {
    color: "white",
    fontSize: 18,
  },
});
