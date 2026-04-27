import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'firebase/auth';
import { loginWithEmailPassword, loginWithGoogle, logout, signupWithEmailPassword } from '../../services/authService';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const credential = await loginWithEmailPassword(email, password);
      return credential.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to login';
      return rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const credential = await signupWithEmailPassword(email, password);
      return credential.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account';
      return rejectWithValue(message);
    }
  }
);

export const loginWithGoogleUser = createAsyncThunk(
  'auth/loginWithGoogleUser',
  async (_, { rejectWithValue }) => {
    try {
      const credential = await loginWithGoogle();
      return credential.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logout();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to logout';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Sign up failed';
      })
      .addCase(loginWithGoogleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Google sign-in failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Logout failed';
      });
  }
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
