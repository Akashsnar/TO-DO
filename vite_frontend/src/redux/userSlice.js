import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

export const signupAsync = createAsyncThunk(
  'user/signupAsync',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, userData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Signup failed');
    }
  }
);

export const loginAsync = createAsyncThunk(
  'user/loginAsync',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

const initialState = {
  isLogin: false,
  loginEmail: null,
  token: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogin = false;
      state.loginEmail = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.fulfilled, (state) => {
        state.error = null;
        alert('Signup successful! You can now log in.');
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.error = action.payload;
        alert(`Signup failed: ${state.error}`);
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { email, token } = action.payload;
        state.isLogin = true;
        state.loginEmail = email;
        state.token = token;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload;
        alert(`Login failed: ${state.error}`);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;