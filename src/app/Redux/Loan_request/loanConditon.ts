import { createSlice } from "@reduxjs/toolkit";
import { reject_loan, approve_loan } from "./loan_request_thunk";

interface LoanConditionState {
  approveLoading: boolean;
  approveSuccess: boolean;
  approveError: string | null;
  approveData: any;

  rejectLoading: boolean;
  rejectSuccess: boolean;
  rejectError: string | null;
  rejectData: any;
}

const initialState: LoanConditionState = {
  approveLoading: false,
  approveSuccess: false,
  approveError: null,
  approveData: null,

  rejectLoading: false,
  rejectSuccess: false,
  rejectError: null,
  rejectData: null,
};

export const loanConditionSlice = createSlice({
  name: "loanCondition",
  initialState,
  reducers: {
    resetApproveState: (state) => {
      state.approveLoading = false;
      state.approveSuccess = false;
      state.approveError = null;
      state.approveData = null;
    },
    resetRejectState: (state) => {
      state.rejectLoading = false;
      state.rejectSuccess = false;
      state.rejectError = null;
      state.rejectData = null;
    },
    resetAllLoanConditionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Approve Loan Cases
      .addCase(approve_loan.pending, (state) => {
        state.approveLoading = true;
        state.approveSuccess = false;
        state.approveError = null;
      })
      .addCase(approve_loan.fulfilled, (state, action) => {
        state.approveLoading = false;
        state.approveSuccess = true;
        state.approveError = null;
        state.approveData = action.payload;
      })
      .addCase(approve_loan.rejected, (state, action) => {
        state.approveLoading = false;
        state.approveSuccess = false;
        // state.approveError = action.error.message as string || "Something went wrong";
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          state.approveError = action.payload.message as string;
        } else {
          state.approveError =
            (action.payload as string) || "Something went wrong";
        }
      })
      // Reject Loan Cases
      .addCase(reject_loan.pending, (state) => {
        state.rejectLoading = true;
        state.rejectSuccess = false;
        state.rejectError = null;
        state.rejectData = null;
      })
      .addCase(reject_loan.fulfilled, (state, action) => {
        state.rejectLoading = false;
        state.rejectSuccess = true;
        state.rejectData = action.payload;
      })
      .addCase(reject_loan.rejected, (state, action) => {
        state.rejectLoading = false;
        state.rejectSuccess = false;

        if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          state.rejectError = action.payload.message as string;
        } else {
          state.rejectError =
            (action.payload as string) || "Failed to reject loan";
        }
      });
  },
});

export const {
  resetApproveState,
  resetRejectState,
  resetAllLoanConditionState,
} = loanConditionSlice.actions;

export default loanConditionSlice.reducer;