import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Axios } from "axios";

const initialState = {
    email: "",
}

const CreateAccountSlice = createSlice({

    name: "CreateAccountData",
    initialState,
    reducers: {

        updateEmail: (state, action) => {
            const getAccountData = action.payload;
            console.log(getAccountData,"slice")
            state.email=getAccountData ;
        },
        deleteAccountData: (state) => {
            state.email = ""
        }

    }

})


export default CreateAccountSlice.reducer;
export const { updateEmail, deleteAccountData } = CreateAccountSlice.actions
