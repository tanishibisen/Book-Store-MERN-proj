import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/trades`;

export const fetchMyTrades = createAsyncThunk('trades/fetchMyTrades', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const requestTrade = createAsyncThunk('trades/requestTrade', async (tradeData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, tradeData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateTradeStatus = createAsyncThunk('trades/updateTradeStatus', async ({ tradeId, status }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.patch(`${API_URL}/${tradeId}`, { status }, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const tradeSlice = createSlice({
  name: 'trades',
  initialState: {
    trades: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTrades.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyTrades.fulfilled, (state, action) => { state.isLoading = false; state.trades = action.payload; })
      .addCase(fetchMyTrades.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(requestTrade.fulfilled, (state, action) => { state.trades.unshift(action.payload); })
      .addCase(updateTradeStatus.fulfilled, (state, action) => {
        const index = state.trades.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.trades[index] = action.payload;
        }
      });
  },
});

export default tradeSlice.reducer;
