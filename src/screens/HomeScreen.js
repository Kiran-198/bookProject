import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback,Dimensions, StyleSheet} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux'; //redux
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMemo } from 'react';//to memoise filtered books 

import { fetchBooks } from '../Redux/Book/BookSlice';//redux
import Bookcard from '../components/Bookcard';
import SearchBar from '../components/searchBar';

import CategoryModal from '../components/CategoryModal'; // for modal 
const categories = ['All', 'Business', 'Computers', 'Economics']; //modal

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);//scrollingToTop
  const [startIndex, setStartIndex] = useState(0)
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);


//  const books = useSelector(state => state.books.books) || [];
// const allBooks = useSelector((state) => [
//   ...state.books.localBooks,
//   ...state.books.apiBooks,
// ])

const localBooks = useSelector(state => state.books.localBooks);
const apiBooks = useSelector(state => state.books.apiBooks);
const editedApiBooks = useSelector(state => state.books.editedApiBooks)
// useEffect(() => {
//   console.log("API Books:", apiBooks);
// }, [apiBooks]);
 const mergedApiBooks = useMemo(() => {
    return apiBooks.map(book => editedApiBooks[book.id] || book);
  }, [apiBooks, editedApiBooks]);
  const allBooks = useMemo( () => [...localBooks, ...mergedApiBooks], 
                               [localBooks, mergedApiBooks])

// const localBooks = useSelector((state) => state.books.localBooks);
// console.log("helllo books",localBooks);

//  const apiBooks = useSelector((state) => state.books.apiBooks);
const loading = useSelector((state) => state.books.loading);

// const allBooks = [...localBooks, ...apiBooks,...books]
  const isFirstLoad = useRef(true)

  const numColumns = isGridView ? (screenWidth > 720 ? 3 : 2) : 1;

// useEffect(() => {
// //    const newStartIndex = 0
// //   setStartIndex(newStartIndex);
// setStartIndex(0); 
//   setIsFetchingMore(false);

//   dispatch(fetchBooks({
//     searchTerm: search || 'all',
//     category: selectedCategory === 'All' ? '' : selectedCategory,
//     startIndex: 0
//   }));
//   if (flatListRef.current) {
//     flatListRef.current.scrollToOffset({ offset: 0, animated: false });
//   }
// }, [search, selectedCategory]);

useEffect(() => {
  if (isFirstLoad.current) {
    dispatch(fetchBooks({
      searchTerm: search || 'all',
      category: selectedCategory === 'All' ? '' : selectedCategory,
      startIndex: 0
    }));
    isFirstLoad.current = false;
  }
}, []);

const filteredBooks = useMemo(() => {
  return allBooks.filter((book) => {
    const title = book.volumeInfo?.title || '';
    const categories = book.volumeInfo?.categories || [];

    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
    book.volumeInfo.categories?.some(cat =>
      cat.toLowerCase().includes(selectedCategory.toLowerCase())
    );

    return matchesSearch && matchesCategory;
  });
}, [allBooks, search, selectedCategory])


  const remainder = filteredBooks.length % numColumns;
  // const fillers = remainder === 0 ? [] : Array(numColumns - remainder).fill({});
  // const paddedBooks = [...filteredBooks, ...fillers];
  const paddedBooks = [...filteredBooks];
if (paddedBooks.length % 2 !== 0) {
  paddedBooks.push({ empty: true });
}
//  console.log("Books from Redux:", books);
  const renderItem = ({ item }) => {
    // console.log(item)
    if (!item || !item.volumeInfo) {
    return <View style={{ flex: 1 }} />;
  }
    return <Bookcard book={item}
      id={item.id}
      isGridView={isGridView}
      navigation={navigation} />;
  };
  const handleLoadMore = () => {
  if (!loading){

  const newStartIndex = startIndex + 20;
  setStartIndex(newStartIndex);
  setIsFetchingMore(true);

  dispatch(fetchBooks({
    searchTerm: search || 'all',
    category: selectedCategory === 'All' ? '' : selectedCategory,
    startIndex: newStartIndex,
    // append: true 
  }));
}}
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.bigContainer}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>BookList</Text>
          <View style={styles.searchContainer}>
            <SearchBar
              search={search}
              onChangeSearch={(text) => setSearch(text)}
            />
            <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterBtn}>
              {selectedCategory === 'All' ? (
                <Ionicons name="filter" size={30} color="black" />
              ) : (
                <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.head2}>
            <Text style={styles.textHead}>Popular Books</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddedBook')} style={styles.personIcon}>
              <Ionicons name="person" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddBook')} style={styles.plusIcon}>
              <Ionicons name="add" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsGridView(prev => !prev)} style={styles.BtnOption}>
              <Ionicons name={isGridView ? "list" : "grid"} size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cards}>
        
            <FlatList
              key={isGridView ? 'grid' : 'list'}
              data={paddedBooks}
              keyExtractor={(item) => item?.id?.toString()}
              numColumns={numColumns}
              ref={flatListRef}
              onScroll={(e) => {
                const offsetY = e.nativeEvent.contentOffset.y;
                setShowScrollTop(offsetY > 100);
              }}
              scrollEventThrottle={16}
              renderItem={renderItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}               
              ListFooterComponent={() => (
                isFetchingMore ? (
                    <ActivityIndicator size="small" style={{ marginVertical: 10 }} />
                ) : null
                )}

            />
          
            <CategoryModal
          visible={filterVisible}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat)}
          onClose={() => setFilterVisible(false)}
        />
          {showScrollTop && (
            <TouchableOpacity onPress={() => flatListRef.current.scrollToOffset({ offset: 0, animated: true })} style={styles.BtnScrollToTop}>
              <Text style={{ color: 'white' }}>Scroll to Top</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
    bigContainer: {
        flex: 1,
        padding: 0,
        //  marginBottom:100
        //  paddingBottom:20
        //  alignItems:'center'  
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
          marginTop:10
        //  backgroundColor:'red'
    },
    headerBox: {
        // borderRadius: 0,
        // margin:10,
        position:'relative',
        backgroundColor:'white',
        backgroundColor:'#f5be84ff',
        // borderWidth:1
    },
    searchContainer:{
      position:'relative',
    justifyContent:'center',
    marginHorizontal:10,
    // borderWidth:1
     //   alignItems:'center',
        },
        
    input: {
        margin: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 0.5,
        borderRadius: 10,
        fontSize: 20,
        backgroundColor: 'white',
        paddingLeft:50,

    },
   
    cards: {
        flex: 1,
         padding: 10,
        //  paddingTop:0,
         justifyContent: 'space-between',
         backgroundColor:'#f4cda1ff',
        // flexDirection:'column',
        // flexWrap:'wrap',
        // width:'100%',
        // alignItems:'flex-start',
        // borderWidth:10
    },
    searchIcon:{
        position:'absolute',
        left:30,
    },
    plusIcon:{
        // position:'absolute',
    // right:50,
    borderWidth:0.5
},
personIcon:{
     borderWidth:0.5,
     borderRadius:10,
     padding:2
},
     BtnScrollToTop:{
        paddingVertical:10,
        // marginHorizontal:'auto',
        // width:'50%',
         paddingHorizontal:20,
         backgroundColor: 'green',
          borderRadius: 10, 
          alignSelf:'center',
        //   justifyContent:'center',
           marginVertical: 10
    },
    filterBtn:{
     alignSelf:'flex-end',
     position:'absolute',
     right:30
    //  borderWidth:1
    },
    head2:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  padding:10,
  marginLeft:15,
  marginRight:15,
//   borderWidth:1
    },
    textHead:{
        fontSize:30,
        fontWeight:'bold'
    },
    BtnOption:{
        
    },
    modalContainer:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "rgba(0,0,0,0.5)",
},
modal1:{
    backgroundColor: 'white',
     padding: 20,
      borderRadius: 10,
       width: '80%'
},
modal2:{
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10
},
selectedCategoryText:{
    fontSize:18,
    fontWeight:'500',
    color:'grey',
},


    //  imageBook: {
    //     width: '100%',
    //     height: 190,
    //     borderRadius: 10,
    //      //  flex: 1,
    // },
    // eachCard: {
    //     flex: 1,
    //     overflow: 'hidden',
    //     borderWidth: 1,
    //     paddingHorizontal: 10,
    //     paddingVertical: 10,
    //     margin: 10,
    //     borderRadius: 15,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     // aspectRatio: 1,
    //     //    flexDirection:'row',
    //     // backgroundColor:'red',
    // },
    // text1: {
    //     fontSize: 15,
    //     marginTop: 10
    // },
    // imageWrap:{
    //     flex:1,
    //     overflow: 'hidden',
    //     borderRadius: 15,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     height:'90%',
    //     width:'100%',
    //     aspectRatio: 0.,
    //     // borderWidth:10
    // },
})

