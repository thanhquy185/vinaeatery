import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentEmployee: null, // chưa đăng nhập
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentEmployee = action.payload;
        },
        logout: (state) => {
            state.currentEmployee = null;
        },
        update: (state, action) => {
            state.currentEmployee = {
                ...(state.currentEmployee ?? {}),
                ...action.payload,
            };
        },
        setEmployee: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { login, logout, update, setEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
