import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAuthState } from "./auth";

// const initialState: IAuthState = {
//   access_token: null,
//   user: {
//     _id: null,
//     name: null,
//     email: null,
//     phoneNumber: null,
//     role: null,
//     affiliateCode: null,
//     sponsorCode: null,
//     licenseInfo: {
//       daysLeft: null,
//       product: null,
//       accessLevel: null
//     },
//     permissions: []
//   }
// }

const initialState: IAuthState | null = null

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state: any, action: PayloadAction<IAuthState>) => {
      const { access_token, user } = action.payload;
      state.access_token = access_token;
      state.user = user;
    },

    resetAuthState: () => initialState,
  },
});

export const { setAuthState, resetAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
