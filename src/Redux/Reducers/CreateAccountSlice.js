import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Axios } from "axios";

const initialState = {
    auth: false,
}

const CreateAccountSlice = createSlice({

    name: "CreateAccountData",
    initialState,
    reducers: {

        updateCreateAccountData: (state, action) => {
            const getAccountData = action.payload;
            state.CreateAccountData.auth = getAccountData;
        },
        deleteAccountData: (state) => {
            state.CreateAccountData = {}
        }

    }

})


export default CreateAccountSlice.reducer;
export const { updateCreateAccountData, deleteAccountData } = CreateAccountSlice.actions
