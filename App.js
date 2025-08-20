import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { ToastProvider } from "./src/context/ToastContext";
import store from "./src/Redux/store"
// import { Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Text,Share,View,Alert,Platform } from "react-native";
import * as Linking from 'expo-linking'

// export const buildBookLink = (id) => `https://mybookapp.com/book/${encodeURIComponent(id)}`;
// export const buildBookLink = (id) => `bookapp://book/${encodeURIComponent(id)}`;
const buildBookLink = (id) =>
  `https://mybookapp.onrender.com/book/${id}`;

import HomeScreen from "./src/screens/HomeScreen";
import BookDetails from "./src/screens/BookDetails";
import AddBookScreen from "./src/screens/AddBookScreen";
import AddedBookScreen from "./src/screens/AddedBookScreen";
// import { ToastProvider } from "./src/context/ToastContext";


const shareBookLink = async (id) => {
  const link = `https://mybookapp.app/book/${id}`; // use HTTPS instead of custom scheme
  try {
    await Share.share(
      Platform.select({
        ios: { url: link, message: link },
        android: { message: link },
      })
    );
  } catch (e) {
    Alert.alert("Could not share", link);
  }
};

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["bookapp://", "https://mybookapp.onrender.com"],
  config: { screens: { Home: "home", BookDetails: "book/:id" } },
};

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer linking={linking} fallback={<Text>Loading..</Text>}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="BookDetails"
              component={BookDetails}
              options={({ route, navigation }) => {
                const b = route.params?.book;
                const id = route.params?.id || b?.id;
                const title = b?.volumeInfo?.title || b?.title || "Book Details";
                return {
                  title,
                  headerRight: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="share-social-outline"
                        size={24}
                        style={{ marginRight: 12 }}
                        onPress={() => {
                          if (!id) return Alert.alert("No book id to share");
                          shareBookLink(id, title);
                        }}
                      />
                      <Ionicons
                        name="create-outline"
                        size={24}
                        onPress={() =>
                          navigation.navigate("AddBook", { bookToEdit: route.params?.book })
                        }
                      />
                    </View>
                  ),
                };
              }}
            />
            <Stack.Screen name="AddBook" component={AddBookScreen} />
            <Stack.Screen name="AddedBook" component={AddedBookScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
}
