import { useEffect, useState, useRef } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";

// Show notification when app is running
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function usePushNotifications() {
  const [pushToken, setPushToken] = useState('');
  const [lastNotification, setLastNotification] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setPushToken(token);
    });

    // Listener when notification is received
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setLastNotification(notification);
      });

    // Listener when user taps a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped notification:", response);
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { pushToken, lastNotification };
}

async function registerForPushNotificationsAsync() {
  console.log("registerForPushNotificationsAsync called");

  if (!Device.isDevice) {
    Alert.alert("Must use a physical device for Push Notifications");
    console.log("Not a physical device");
    return null;
  }

  // Check permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Failed to get push token");
    console.log("Permission not granted");
    return null;
  }

  let token;
  try {
    if (Platform.OS === "android") {
      // For Android standalone apps → FCM token
      const tokenResponse = await Notifications.getDevicePushTokenAsync();
      token = tokenResponse.data;
      console.log("FCM Device Token:", token);
    } else {
      // For iOS or Expo Go → Expo push token
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      token = tokenResponse.data;
      console.log("Expo Push Token:", token);
    }
  } catch (error) {
    console.log("❌ Error fetching push token:", error);
    return null;
  }

  // Create Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
