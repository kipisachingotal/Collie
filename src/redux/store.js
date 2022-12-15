import { configureStore } from '@reduxjs/toolkit'
import mainSliceReducer from './mainStore'

export const store = configureStore({
  reducer: {
    mainSlice:mainSliceReducer,
  },
})