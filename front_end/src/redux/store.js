import { configureStore } from '@reduxjs/toolkit'

import pageReducer from './inventory_reducer'
import i18Reducer from './i18_reducer'

export default configureStore({
  reducer: {
    page: pageReducer,
    i18: i18Reducer,
  },
})