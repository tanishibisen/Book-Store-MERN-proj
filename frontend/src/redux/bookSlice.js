import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/books`;

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (params, thunkAPI) => {
  try {
    const { search, lat, lng, radius } = params || {};
    let query = '?status=Available';
    if (search) query += `&search=${search}`;
    if (lat && lng && radius) query += `&lat=${lat}&lng=${lng}&radius=${radius}`;
    
    const response = await axios.get(`${API_URL}${query}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchMyBooks = createAsyncThunk('books/fetchMyBooks', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}/my/books`, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addBook = createAsyncThunk('books/addBook', async (bookData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, bookData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    myBooks: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => { state.isLoading = false; state.books = action.payload; })
      .addCase(fetchBooks.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchMyBooks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyBooks.fulfilled, (state, action) => { state.isLoading = false; state.myBooks = action.payload; })
      .addCase(fetchMyBooks.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(addBook.fulfilled, (state, action) => { state.myBooks.push(action.payload); });
  },
});

export default bookSlice.reducer;
