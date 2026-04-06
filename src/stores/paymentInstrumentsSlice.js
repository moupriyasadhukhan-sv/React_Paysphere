import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "../services/paymentService";

export const fetchInstruments = createAsyncThunk(
  "paymentInstruments/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentService.getInstruments();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteInstrument = createAsyncThunk(
  "paymentInstruments/delete",
  async (id, { dispatch }) => {
    await paymentService.deleteInstrument(id);
    dispatch(fetchInstruments());
  }
);

export const setDefaultInstrument = createAsyncThunk(
  "paymentInstruments/setDefault",
  async (id, { dispatch }) => {
    await paymentService.setDefault(id);
    dispatch(fetchInstruments());
  }
);

export const updateInstrumentStatus = createAsyncThunk(
  "paymentInstruments/updateStatus",
  async ({ id, status }, { dispatch }) => {
    await paymentService.updateInstrumentStatus(id, status);
    dispatch(fetchInstruments());
  }
);

const paymentInstrumentsSlice = createSlice({
  name: "paymentInstruments",
  initialState: {
    instruments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstruments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInstruments.fulfilled, (state, action) => { state.loading = false; state.instruments = action.payload; })
      .addCase(fetchInstruments.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default paymentInstrumentsSlice.reducer;
