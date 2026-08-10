import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employee-slice';

// Kiểu dữ liệu của store
export type RootState = ReturnType<typeof store.getState>;

// Cấu hình store gốc
export const store = configureStore({
    reducer: {
        employee: employeeReducer,
    },
});
