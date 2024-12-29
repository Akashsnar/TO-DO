import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Backend URLs
const BASE_URL = 'https://to-do-rcm0.onrender.com/auth';

// Define the state structure
interface UserState {
  isLogin: boolean;
  loginEmail: string | null;
  token: string | null;
  error: string | null;
}

// Define the API response types
interface LoginResponse {
  email: string;
  token: string;
}

interface SignupResponse {
  message: string;
}

// Define the state type
const initialState: UserState = {
  isLogin: false,
  loginEmail: null,
  token: null,
  error: null,
};

// Async actions
export const signupAsync = createAsyncThunk<
  SignupResponse,
  { name: string; email: string; password: string }, // Payload type for the signup action
  { rejectValue: string } // Reject value type
>('user/signupAsync', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data; // Ensure this matches your API response
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Signup failed');
  }
});

export const loginAsync = createAsyncThunk<
  LoginResponse,
  { email: string; password: string }, // Payload type for the login action
  { rejectValue: string } // Reject value type
>('user/loginAsync', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Slice definition
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogin = false;
      state.loginEmail = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.fulfilled, (state) => {
        state.error = null;
        alert('Signup successful! You can now log in.');
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.error = action.payload || 'Signup failed';
        alert(`Signup failed: ${state.error}`);
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        const { email, token } = action.payload;
        state.isLogin = true;
        state.loginEmail = email;
        state.token = token;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload || 'Login failed';
        alert(`Login failed: ${state.error}`);
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
