import { configureStore } from '@reduxjs/toolkit'

import pageReducer from './inventory_reducer'

export default configureStore({
  reducer: {
    page: pageReducer
  },
})