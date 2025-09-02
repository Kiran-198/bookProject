import React, { useMemo, useRef, useContext, useCallback,useLayoutEffect } from 'react';
import { View, FlatList, Alert, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Bookcard from '../components/Bookcard';
import { ThemeContext } from '../context/ThemeContext';
import { resetLocalBooks ,deleteLocalBook} from '../Redux/Book/BookSlice';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
const screenWidth = Dimensions.get('window').width;

export default function LocalBookScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  const localBooks = useSelector(state => state.books.localBooks);

  const numColumns = screenWidth > 720 ? 3 : 2;

  const remainder = localBooks.length % numColumns;
  const paddedBooks = [...localBooks];
  if (remainder !== 0) {
    paddedBooks.push(...Array(numColumns - remainder).fill({ empty: true }));
  }

 const renderItem = useCallback(
  ({ item }) => {
    if (item.empty) {
      return <View style={{ flex: 1, margin: 10, minHeight: 250 }} />;
    }

    return (
      <View style={{ flex: 1, margin: 0, minHeight: 250 }}>
        <Bookcard book={item} id={item.id} isGridView={true} navigation={navigation} />
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Delete Book",
              "Are you sure you want to delete this book?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => dispatch(deleteLocalBook(item.id)) }
              ]
            )
          }
          style={{ position: "absolute",bottom:20,right:15}}
        >
          <Ionicons name="trash-outline" size={20} color={theme.icon} />
        </TouchableOpacity>
      </View>
    );
  },
  [navigation, dispatch]
);


  const handleClearLocalBooks = () => {
    Alert.alert(
      'Clear Local Books',
      'Are you sure you want to delete all local books?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => dispatch(resetLocalBooks()) },
      ]
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Local Books',
      headerRight: () => (
        <TouchableOpacity onPress={handleClearLocalBooks} style={{ marginRight: 15 }}>
          <Ionicons name="trash-outline" size={24} color='black' />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, localBooks]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    
      <StatusBar
        barStyle="dark-content"          // dark icons for light bg
        backgroundColor="#f4d9bbff"      // match header bg or a slightly darker shade
        translucent={false}
      />
      <FlatList
        data={paddedBooks}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        numColumns={numColumns}
        ref={flatListRef}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, paddingHorizontal: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    padding: 0,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
});
