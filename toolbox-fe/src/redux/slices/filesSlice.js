import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

// Thunk para obtener los datos de archivos
export const fetchFilesData = createAsyncThunk(
  'files/fetchFilesData',
  async (fileName, { rejectWithValue }) => {
    try {
      return await apiService.getFilesData(fileName);
    } catch (error) {
      return rejectWithValue(`Error al cargar los datos: ${error.message}`);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  filterName: ''
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilterName: (state, action) => {
      state.filterName = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFilesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilterName, clearError } = filesSlice.actions;
export default filesSlice.reducer;
