import * as React from "react";
import { Provider } from "react-redux";
import { ToastProvider } from "./src/context/ToastContext";
// import store from "./src/Redux/store";
import { store,persistor } from "./src/Redux/store";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppContent from "./src/components/AppContent";
import usePushNotifications from "./src/hooks/usePushNotifications";
import { useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  const {pushToken,lastNotification}=usePushNotifications()
    // console.log("Got push token:", expoPushToken);
 useEffect(() => {
  if (pushToken) {
    console.log("Got push token:", pushToken);
    // ✅ send this to your Node.js backend for FCM
  }
}, [pushToken])

  
  
  return (
    <SafeAreaProvider>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ToastProvider>
      </PersistGate>
    </Provider>
    </SafeAreaProvider>
  );
}
