import { createSlice } from '@reduxjs/toolkit'

const i18Slice = createSlice({
  name: 'i18',
  initialState: {
    language: "en",
    country: "USA",
  },
  reducers: {
    updateLanguage: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.language = action.payload
    },
    updateCountry: (state, action) => {
      state.country = action.payload
    }
  },
})

export const {
  updateCountry,
  updateLanguage,
} = i18Slice.actions

export default i18Slice.reducer
