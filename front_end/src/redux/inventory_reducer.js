import { createSlice } from '@reduxjs/toolkit'

const pageSlice = createSlice({
  name: 'page',
  initialState: {
    pageData: [],
    currentPage: 1,
    totalCount: 0,
    recordsPerPage: 15
  },
  reducers: {
    updatePage: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.currentPage = action.payload
    },
    updatePageData: (state, action) => {
      state.pageData = action.payload
    },
    updateTotalCount: (state, action) => {
      state.totalCount = action.payload
    },
  },
})

export const {
  updatePage,
  updatePageData,
  updateTotalCount
} = pageSlice.actions

export default pageSlice.reducer
