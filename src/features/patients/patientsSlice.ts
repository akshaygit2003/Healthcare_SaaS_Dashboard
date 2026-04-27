import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mapDummyUserToPatient, type Patient } from '../../data/patients';

export type ViewMode = 'grid' | 'list';

const PAGE_LIMIT = 15;

type DummyUsersResponse = {
  users: Array<{
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    phone: string;
    company?: {
      department?: string;
    };
  }>;
  total: number;
  skip: number;
  limit: number;
};

type PatientsState = {
  data: Patient[];
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  currentPage: number;
  total: number;
  limit: number;
};

const initialState: PatientsState = {
  data: [],
  viewMode: 'grid',
  loading: false,
  error: null,
  currentPage: 1,
  total: 0,
  limit: PAGE_LIMIT
};

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async ({ page }: { page: number }, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * PAGE_LIMIT;
      const response = await fetch(`https://dummyjson.com/users?limit=${PAGE_LIMIT}&skip=${skip}`);

      if (!response.ok) {
        return rejectWithValue('Unable to fetch patient data.');
      }

      const payload = (await response.json()) as DummyUsersResponse;

      return {
        // @ts-ignore
        data: payload.users.map(mapDummyUserToPatient),
        total: payload.total,
        limit: payload.limit,
        currentPage: page
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to fetch patient data.';
      return rejectWithValue(message);
    }
  }
);

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Unable to fetch patients.';
      });
  }
});

export const { setViewMode, setCurrentPage } = patientsSlice.actions;
export default patientsSlice.reducer;
