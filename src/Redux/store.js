import { configureStore } from '@reduxjs/toolkit'
import issueReducer from './slice/issueSlice'
import authReducer from './slice/authSlice'
import staffReducer from './slice/staffSlice'
const civicStore = configureStore({
    reducer: {
        issueReducer: issueReducer,
        authReducer: authReducer,
     staffReducer: staffReducer,
 
    }
})

export default civicStore