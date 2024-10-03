import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice'; 
import authReducer from './slices/authSlice'; 
import adminAuthReducer from './slices/adminAuthSlice'; 

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, 
        auth: authReducer,
        adminAuth: adminAuthReducer, 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware), 
});

export default store;
