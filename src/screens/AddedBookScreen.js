import React from 'react';
import { useSelector } from 'react-redux';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
const AddedBookScreen = () => {
const books = useSelector((state) => state.books.books) || [];

 const renderItem = ({ item,route }) => {
  const {book}=route.params
  // const volume = item.volumeInfo || {};
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
    <View style={styles.card}>
      <Image source={{ uri: book?.volumeInfo?.imageLinks?.thumbnail }} style={styles.image} />
      <Text style={styles.title}>{volume.title}</Text>
      <Text>{volume.description}</Text>
    </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AddedBookScreen;
