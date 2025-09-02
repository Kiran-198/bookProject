import React, { useEffect, useState, useRef ,useCallback} from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback,Dimensions, StyleSheet} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux'; //redux
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMemo ,useContext} from 'react';//to memoise filtered books
import { ThemeContext } from '../context/ThemeContext'; 
import { fetchBooks } from '../Redux/Book/BookSlice';//redux
import Bookcard from '../components/Bookcard';
import SearchBar from '../components/searchBar';
import { StatusBar ,Animated} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar'
import CategoryModal from '../components/CategoryModal'; // for modal 
const categories = ['All', 'Business', 'Computers', 'Economics']; //modal
import { useFocusEffect } from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
import { useToast } from '../context/ToastContext';
import { RefreshControl } from 'react-native';
import { persistor } from '../Redux/store';
import { resetLocalBooks } from '../Redux/Book/BookSlice';

export default function HomeScreen() {
   const { showToast } = useToast()
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);//scrollingToTop
  // const [setStartIndex] = useState(0)
  const [isFetchingMore, setIsFetchingMore] = useState(false);
 const { theme, toggleTheme, isDarkTheme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGridView, setIsGridView] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current
  const [refreshing,setRefreshing]=useState(false)
const localBooks = useSelector(state => state.books.localBooks);
const apiBooks = useSelector(state => state.books.apiBooks);
const editedApiBooks = useSelector(state => state.books.editedApiBooks)

 const mergedApiBooks = useMemo(() => {
    return apiBooks.map(book => editedApiBooks[book.id] || book);
  }, [apiBooks, editedApiBooks]);
  
  const allBooks = useMemo( () => [...localBooks, ...mergedApiBooks], 
                               [localBooks, mergedApiBooks])

const { loading, hasMore, startIndex} = useSelector((state) => state.books);

  const isFirstLoad = useRef(true)
  const shownToastRef = useRef(false)
  const numColumns = isGridView ? (screenWidth > 720 ? 3 : 2) : 1;

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
  const paddedBooks = [...filteredBooks];
if (remainder !== 0) {
  paddedBooks.push(...Array(numColumns - remainder).fill({ empty: true }));
}
//  console.log("Books from Redux:", books);
  const renderItem = useCallback(({ item }) => {
    // console.log(item)
    if (!item || !item.volumeInfo) {
    return <View style={{ flex: 1, minHeight: 200 }} />;
  }
    return <Bookcard book={item}
      id={item.id}
      isGridView={isGridView}
      navigation={navigation} />;
  },[isGridView,navigation])

const [page, setPage] = useState(0);

const handleLoadMore = useCallback(() => {
  if (loading) return;

  if (!hasMore) {
    showToast("No more books available");
    return;
  }

  dispatch(fetchBooks({
    searchTerm: search || 'all',
    category: selectedCategory === 'All' ? '' : selectedCategory,
    startIndex: startIndex + 20,
  }));
}, [dispatch, search, selectedCategory, hasMore, loading, startIndex])

  
const handleRefresh = useCallback(() => {
  setRefreshing(true);

  dispatch(fetchBooks({
    searchTerm: search || 'all',
    category: selectedCategory === 'All' ? '' : selectedCategory,
    startIndex: 0, // always refresh from start
  })).finally(() => {
    setRefreshing(false);
  });
}, [dispatch, search, selectedCategory])

useEffect(() => {
  Animated.timing(rotation, {
    toValue: isDarkTheme ? 1 : 0,
    duration: 600,
    useNativeDriver: true, // better performance
  }).start();
}, [isDarkTheme]);

const spin = rotation.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

// useEffect(() => {
//   console.log("API Books:", apiBooks.length);
// }, [apiBooks]);

// useEffect(() => {
//   console.log("Local Books:", localBooks.length);
// }, [localBooks])
const onEndReachedCalledDuringMomentum = useRef(false)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.background }}>
        <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBackground} 
        animated={true}
        />
        <View  style={[styles.headerBox, { backgroundColor: theme.headerBackground }]}>
          <View style={styles.newHead}>
          <Text style={[styles.title, { color: theme.text }]}>BookList</Text>
          <TouchableOpacity onPress={() => navigation.navigate('localBooks')} style={[styles.newIcon,{borderColor:theme.borderColor}]}>
            <Ionicons name="cart" size={35} color={theme.icon} />
          </TouchableOpacity>
        </View>
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
            <Text style={[styles.textHead, { color: theme.text }]}>Popular Books</Text>
            <TouchableOpacity onPress={toggleTheme}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name={isDarkTheme ? "sunny" : "moon"} size={28} color={theme.icon} />
          </Animated.View>
        </TouchableOpacity>
           
            <TouchableOpacity onPress={() => navigation.navigate('AddBook')} style={[styles.plusIcon,{borderColor:theme.borderColor}]}>
              <Ionicons name="add" size={28} color={theme.icon}   />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsGridView(prev => !prev)} style={styles.BtnOption}>
              <Ionicons name={isGridView ? "list" : "grid"} size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.cards, { backgroundColor: theme.cardBackground }]}>
        
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
              // onEndReached={handleLoadMore}
              onEndReached={() => {
    if (!onEndReachedCalledDuringMomentum.current) {
      handleLoadMore();
      onEndReachedCalledDuringMomentum.current = true;
    }
  }}
  onMomentumScrollBegin={() => {
    onEndReachedCalledDuringMomentum.current = false;
  }}
              onEndReachedThreshold={0.1} 
              initialNumToRender={20}
               refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#191a1bff']} // Android spinner color
                tintColor="#191a1bff"   // iOS spinner color
              />
            }
              ListFooterComponent={() => (
                loading && hasMore ? (
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
    newHead:{
      flexDirection: 'row',
       alignItems: 'center',
        justifyContent: 'space-between', 
        paddingHorizontal:20, 
        paddingVertical: 10 ,
        marginTop:10
    },
    newIcon:{
      // marginTop:10
      marginRight:10
    },
    title: {
        // alignSelf: 'center',
        fontSize: 40,
        fontWeight: 'bold',
          // marginTop:10
        //  backgroundColor:'red'
    },
    headerBox: {
        // borderRadius: 0,
        // margin:10,
        position:'relative',
        // backgroundColor:'white',
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
        paddingVertical: 20,
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
    // borderWidth:0.5
},
intoIcon:{
  // borderWidth:0.5
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
  marginRight:12,
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
})

