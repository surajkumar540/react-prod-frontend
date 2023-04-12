import { configureStore } from "@reduxjs/toolkit";
import CreateAccountDataReducer from "../Reducers/CreateAccountSlice";
// import AllDataSlice from "../Reducers/AllDataSlice";
// import CurrentPropertySlice from "../Reducers/CurrentPropertySlice";

export default configureStore({
    reducer: {
        CreateAccountUserData: CreateAccountDataReducer,
        // AllData: AllDataSlice,
        // CurrentProperty: CurrentPropertySlice
    },
});
