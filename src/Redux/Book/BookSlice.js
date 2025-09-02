import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async ({ searchTerm = 'all', category = '', startIndex = 0 }) => {  
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q={SEARCH_TERM}&subject:${category === "" ? "" : category
      }&startIndex=${startIndex}&maxResults=20`
    const response = await axios.get(url);
    // const data = await response.json();
  // console.log('ho',response);

    // return response.data.items || []
    const books = (response.data.items || []).map(book => ({
  ...book,
  isApiBook: true,
}));
return {
        books,
        totalItems: response.data.totalItems || 0,
        startIndex,
      }
  } catch (error) {
    console.error('Error fetching books:', error);
    return []; 
  }
}
);

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    apiBooks: [],
    localBooks: [],
     editedApiBooks: {},
    loading: false,
    error: null,
    searchTerm: '',
    category: 'All',
    totalItems: 0,
    hasMore: true,
    startIndex: 0,
  },
  reducers: {
    addLocalBook: (state, action) => {
      state.localBooks.unshift(action.payload);
          },
    updateLocalBook: (state, action) => {
      const index = state.localBooks.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.localBooks[index] = action.payload;
      }
    },
updateApiBook: (state, action) => {
  const { id, ...changes } = action.payload;
  state.editedApiBooks[id] = {
    ...(state.editedApiBooks[id] || {}),
    ...changes,
    isApiBook: true,
  };
},
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    resetPagination: (state) => {
      state.startIndex = 0;
    },
    incrementStartIndex: (state) => {
      state.startIndex += 20;
    },
    resetBooks: (state) => {
      state.apiBooks = [];
      state.totalItems = 0;
      state.hasMore = true;
      state.startIndex = 0;
    },
    resetLocalBooks: (state) => {
    state.localBooks = [];
  },
    deleteLocalBook: (state, action) => {
    state.localBooks = state.localBooks.filter(
      (book) => book.id !== action.payload
    );
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        const { books, totalItems, startIndex } = action.payload;

        if (startIndex === 0) {
          state.apiBooks = books;
        } else {
          // append but avoid duplicates by id
          const existingIds = new Set(state.apiBooks.map(b => b.id));
          const newBooks = books.filter(b => !existingIds.has(b.id));
          state.apiBooks = [...state.apiBooks, ...newBooks];
        }

        state.totalItems = totalItems;
        // state.hasMore = state.apiBooks.length < totalItems;
        if (books.length === 0) {
    state.hasMore = false;
  } else {
    state.hasMore = state.apiBooks.length < totalItems;
  }
        state.startIndex = startIndex;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addLocalBook,
  updateLocalBook,
  updateApiBook,
  setSearchTerm,
  setCategory,
  resetPagination,
  incrementStartIndex,
  resetBooks,
  resetLocalBooks,
  deleteLocalBook
} = bookSlice.actions;
export default bookSlice.reducer;