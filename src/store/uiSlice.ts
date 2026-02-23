import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  selectedCategoryId: number | null;
  selectedAuthorId: number | null;
}

const initialState: UiState = {
  searchQuery: '',
  selectedCategoryId: null,
  selectedAuthorId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategoryId(state, action: PayloadAction<number | null>) {
      state.selectedCategoryId = action.payload;
    },
    setSelectedAuthorId(state, action: PayloadAction<number | null>) {
      state.selectedAuthorId = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.selectedCategoryId = null;
      state.selectedAuthorId = null;
    },
  },
});

export const { setSearchQuery, setSelectedCategoryId, setSelectedAuthorId, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;
