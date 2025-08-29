import React, { useContext, useRef,useEffect } from "react";
import { StatusBar, Text, View, Alert, Share, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import * as NavigationBar from 'expo-navigation-bar';
import HomeScreen from "../screens/HomeScreen";
import BookDetails from "../screens/BookDetails";
import AddBookScreen from "../screens/AddBookScreen";
import AddedBookScreen from "../screens/AddedBookScreen";

const linking = {
  prefixes: ["bookapp://", "https://mybookapp.onrender.com"],
  config: { screens: { Home: "home", BookDetails: "book/:id" } },
};

const Stack = createNativeStackNavigator();

export default function AppContent() {
  const { theme, isDarkTheme } = useContext(ThemeContext);
  const isSharingRef = useRef(false);

  const shareBookLink = async (id) => {
    const link = `https://mybookapp.app/book/${id}`;
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
  useEffect(() => {
  // Android navigation bar
  NavigationBar.setBackgroundColorAsync(theme.headerBackground);
  NavigationBar.setButtonStyleAsync(isDarkTheme ? 'light' : 'dark');
}, [theme, isDarkTheme])

  return (
    <>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={theme.headerBackground}
        animated={true}
      />

      <NavigationContainer linking={linking} fallback={<Text>Loading..</Text>}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
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
                      onPress={async () => {
                        if (!id) return Alert.alert("No book id to share");
                        if (isSharingRef.current) return; 
                        isSharingRef.current = true; 
                        try {
                          await shareBookLink(id);
                        } finally {
                          setTimeout(() => {
                            isSharingRef.current = false;
                          }, 1000);
                        }
                      }}
                    />
                    <Ionicons
                      name="create-outline"
                      size={24}
                      onPress={() =>
                        navigation.navigate("AddBook", { bookToEdit: b })
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
    </>
  );
}
