import { useState, useMemo, useRef, useCallback, useContext, useEffect } from 'react';
import axios from 'axios';
import { BookContext } from '../context/BookContext';
import Bookcard from '../components/Bookcard';
import { useNavigation } from '@react-navigation/native'

// const navigation = useNavigation()
export default function useBooks(navigation,selectedCategory,isGridView) {
  const { state, dispatch } = useContext(BookContext);
  const { books, loading, search } = state;
  const prevBooks = state.books;

  const [startIndex, setStartIndex] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const flatListRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchBooks = async (initial = false) => {
    if (initial) {
      dispatch({ type: 'SET_LOADING', payload: true });
      setStartIndex(0);
    } else {
      setIsFetchingMore(true);
    }
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q={SEARCH_TERM}&subject:%7BSELECTED_CATEGORY%7D&startIndex=${startIndex}&maxResults=20`
      );
      const newBooks = response.data.items || [];
      if (initial) {
        dispatch({ type: 'SET_BOOKS', payload: newBooks });
      } else {
        dispatch({ type: 'SET_BOOKS', payload: [...prevBooks, ...newBooks] });
      }
      setStartIndex((prev) => prev + 20);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMore) {
      fetchBooks(false);
    }
  };

  const filteredBooks = useMemo(() => {
    const term = search.toLowerCase();
    return books.filter((book) => {
      const title = book.volumeInfo?.title?.toLowerCase() || '';
      const authors = (book.volumeInfo?.authors || []).join(' ').toLowerCase();
      const desc = book.volumeInfo?.description?.toLowerCase() || '';
        const categories = book.volumeInfo?.categories?.join(' ').toLowerCase() || '';

      const matchesSearch = title.includes(term) || authors.includes(term) || desc.includes(term);
    const matchesCategory = selectedCategory === 'All' || categories.includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
    });
  }, [search, books,selectedCategory]);

  const goToDetailsPage = useCallback((item) => {
    navigation.navigate('BookDetails', { book: item });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => {
    if (item.isPlaceholder) {
  return <View style={{ flex: 1, margin: 10 }} />;
}

return(
    <Bookcard book={item} onPress={() => goToDetailsPage(item)} isGridView={isGridView}  />
)
}, [goToDetailsPage,isGridView]);

  const keyExtractor = useCallback((item, index) => item.id ?? index.toString(), []);

  useEffect(() => {
    fetchBooks(true);
  }, []);

  return {
    state,
    dispatch,
    filteredBooks,
    isFetchingMore,
    handleLoadMore,
    renderItem,
    keyExtractor,
    flatListRef,
    showScrollTop,
    setShowScrollTop,
  };
}


