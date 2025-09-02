import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import React, {useState}from 'react';
import { useRoute } from '@react-navigation/native';
import { Pressable,Linking } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { useContext} from 'react';
import { ThemeContext } from '../context/ThemeContext';
const Tab = createMaterialTopTabNavigator();
import { StatusBar } from 'react-native';

function  About({route}){
  const {book}=route.params
  // console.log("hello books from home",book);
 const { theme } = useContext(ThemeContext);
  
  return(
    // <ScrollView>
  <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
    <Text style={[styles.text1, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Kind : </Text>{book?.kind}</Text>
    <Text style={[styles.text1, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Id : </Text>{book?.id}</Text>
    <Text style={[styles.text1, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Etag : </Text> {book?.etag}</Text>
    <Text style={[styles.text1, { color: theme.text }]}>
  <Text style={[styles.label, { color: theme.text }]}> Price: </Text> 
  {
    book?.saleInfo?.listPrice?.amount
      ? `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode || ''}`
      : (book?.volumeInfo?.price !== undefined
          ? `${book.volumeInfo.price} USD`   // or currency you want
          : 'N/A'
        )
  }
</Text>
  </View>
  // </ScrollView>
  )
}
function  VolumeInfo({route}){
  const {book}=route.params
  const { theme } = useContext(ThemeContext);
 const url = book?.volumeInfo?.infoLink || book?.volumeInfo?.link;
  return(
    // <ScrollView>
  <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Title: </Text> {book?.volumeInfo?.title}</Text>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Category: </Text> {book?.volumeInfo?.categories}</Text>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> Publisher: </Text> {book?.volumeInfo?.publisher}</Text>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> PublishedDate: </Text> {book?.volumeInfo?.publishedDate}</Text>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> PageCount: </Text> {book?.volumeInfo?.pageCount}</Text>
    <Text style={[styles.text2, { color: theme.text }]}><Text style={[styles.label, { color: theme.text }]}> PrintType: </Text> {book?.volumeInfo?.printType}</Text>
    <Pressable onPress={()=> url && Linking.openURL(url)}>
    <Text style={styles.linkText}> Link  </Text>
    {/* {book?.volumeInfo?.imageLinks?.smallThumbnail} */}
    </Pressable>
  </View>
  // </ScrollView>
  )
}
function Info({route}){
  const {book}=route.params
   const { theme } = useContext(ThemeContext);

  const [readMore, setReadMore] = useState(false)
const description = book?.volumeInfo?.description 
const toggleReadMore = () => setReadMore(!readMore)
const displayedText = readMore ? description : description.length > 200  ? description.slice(0, 200) + '...'  : description;

  return(
    <ScrollView contentContainerStyle={{
        flexGrow: 1,
        // backgroundColor: '#f4d9bbff',
        //  padding: 30,
      }}>
  <View style={[styles.tabContent, { backgroundColor: theme.background }]}> 
  <Text style={{ fontSize: 18, lineHeight: 25 ,color:theme.text}}><Text style={[styles.label, { color: theme.text }]}> Description: </Text> {displayedText} </Text>
  {description.length > 200 && (
    <Pressable onPress={toggleReadMore}>
  <Text style={{ color: 'green', marginTop: 8 ,textDecorationLine:'underline',fontSize:18}}>
    {readMore ? 'Read Less' : 'Read More'}
  </Text>
</Pressable>
  )}
  </View> 
  </ScrollView>)
}

function  Authors({route}){
  const {book}=route.params
  const authors = book?.volumeInfo?.authors
  const { theme } = useContext(ThemeContext);
  //  const authors = book?.authors
  // const {volumeInfo}=book
 return (
    <View style={[styles.tabContent, { backgroundColor: theme.background }]}>
      {Array.isArray(authors) ? (
        authors.map((author, index) => (
          <Text key={index} style={[styles.text3, { color: theme.text }]}>{author}</Text>
        ))
      ) : (
        <Text style={[styles.text3, { color: theme.text }]}>No authors available</Text>
      )}
    </View>
  );
}
  
export default function BookDetails() {
  // const route = useRoute();
  // const { book } = route.params;
  const route = useRoute();
  const passedBook = route.params?.book;
  const bookId = route.params?.id;   // comes from deep link
 const { theme, toggleTheme, isDarkTheme } = useContext(ThemeContext);
  const allBooks = useSelector((state) => state.books.apiBooks || []);
  const [book, setBook] = React.useState(passedBook || null);

  React.useEffect(() => {
    if (!book && bookId) {
      const found = allBooks.find((b) => String(b.id) === String(bookId));
      if (found) {
        setBook(found);
      } else {
        console.log("Book not found in redux. You may fetch from API here.");
      }
    }
  }, [bookId, allBooks]);

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading book...</Text>
      </View>
    );
  }

  const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail 
   const title= book?.title
  return (
    <SafeAreaView style={{ flex: 1 }}  edges={[]}>
     <StatusBar
  barStyle="dark-content"          // dark icons for light bg
  backgroundColor="#f4d9bbff"      // match header bg or a slightly darker shade
  translucent={false}
/>

        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
          <Image source={{ uri: thumbnail }} style={styles.imageBook}/>
        </View>
        <Tab.Navigator  screenOptions={{
          tabBarStyle:{
            // backgroundColor:'white',
            backgroundColor: theme.cardBackground,
  
          },tabBarLabelStyle:{
            fontSize:14,
             fontWeight:'bold',
            // color:'black',
             color: theme.text,
          },
          tabBarActiveTintColor:'green',
          tabBarInactiveTintColor:'gray',
          tabBarIndicatorStyle:{
            backgroundColor:'green',
            height:5,
            borderRadius:10
          },
           
        }}>
      <Tab.Screen name="About" component={About} initialParams={{ book }}/>
      <Tab.Screen name="VolumeInfo" component={VolumeInfo} initialParams={{ book }}/>
      <Tab.Screen name="Info" component={Info} initialParams={{ book }}/>
      <Tab.Screen name="Authors" component={Authors} initialParams={{ book }}/> 
    </Tab.Navigator> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
     height:'40%',
     width:'100%',
     alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f4d9bbff',
    //   //  paddingHorizontal:20,
    //     //  paddingVertical:20,
    //     // width:'100%',
  },
  imageBook: {
    height: '90%',
    width: '60%',
      aspectRatio:0.7,
   borderRadius:10,
      //  margin: 20,
     
  },
  tabContent:{
    flex:1,
    paddingHorizontal:20,
    paddingVertical:20,
    marginBottom:10,
    // backgroundColor:'white',
    // marginLeft:30
    // borderWidth:10
  },
  text1:{
    fontSize:20,
    fontWeight:'400',
    paddingVertical:8,
    // paddingHorizontal:20,
    // backgroundColor:'#f4d9bbff',
    // paddingTop:10
  },
  text2:{
    fontSize:20,
    fontWeight:'400',
     paddingVertical:5,
    // backgroundColor:'#f4d9bbff',

  },
  text3:{
    fontSize:20,
    paddingVertical:5,
    fontWeight:'500',
    color:'#333',
    // backgroundColor:'#f4d9bbff',

  },
  // text4:{
  //   fontSize:20,
  //   justifyContent:'center'
  // },
  linkText:{
    color:'green',
    fontSize:24,
    fontWeight:'bold',
    textDecorationLine:'underline',
    // paddingVertical:5
  },
  label:{
    fontSize:20,
    fontWeight:'600',
    color:'#333',
    // paddingLeft:10
  }

  });
  