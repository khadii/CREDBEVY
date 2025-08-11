import { createSlice } from "@reduxjs/toolkit";
import {
  all_loan_requests,
  loan_request_stat,
  _loan_request_trend,
  _single_loan_products_request,
} from "./loan_request_thunk";

interface LoanRequest {
  LoanRequestStat: {
    data: any;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  LoanRequestAll: {
    data: any;
    loading: boolean;
    error: string | null;
    success: string | null;
    total_count: string | null;
  };
  loan_request_trend: {
    data: any;
    loading: boolean;
    error: string | null;
    success: string | null;
  };
  single_loan_products_request: {
    data: any;
    loading: boolean;
    error: string | null;
    success: string | null;
    user_info_status: any;
  };
}

const initialState: LoanRequest = {
  LoanRequestStat: { data: null, loading: false, error: null, success: null },
  LoanRequestAll: {
    data: null,
    loading: false,
    error: null,
    success: null,
    total_count: null,
  },
  loan_request_trend: {
    data: null,
    loading: false,
    error: null,
    success: null,
  },
  single_loan_products_request: {
    data: null,
    loading: false,
    error: null,
    success: null,
    user_info_status: null,
  },
};

const loanRequestSlice = createSlice({
  name: "loanRequest",
  initialState,
  reducers: {
    resetLoanRequestStatSuccess: (state) => {
      state.LoanRequestStat.success = null;
    },
    resetLoanRequestAllSuccess: (state) => {
      state.LoanRequestAll.success = null;
    },
    resetLoanRequestTrendSuccess: (state) => {
      state.loan_request_trend.success = null;
    },
    resetSingleLoanProductsRequestSuccess: (state) => {
      state.single_loan_products_request.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loan_request_stat.pending, (state) => {
        state.LoanRequestStat.loading = true;
        state.LoanRequestStat.error = null;
      })
      .addCase(loan_request_stat.fulfilled, (state, action) => {
        state.LoanRequestStat.loading = false;
        if (action.payload.error) {
          state.LoanRequestStat.error = action.payload.message;
        }
        state.LoanRequestStat.data = action.payload.data;
        state.LoanRequestStat.success = action.payload.message;
      })
      .addCase(loan_request_stat.rejected, (state, action) => {
        state.LoanRequestStat.loading = false;
        state.LoanRequestStat.error = action.payload as string;
      })
      .addCase(all_loan_requests.pending, (state) => {
        state.LoanRequestAll.loading = true;
        state.LoanRequestAll.error = null;
      })
      .addCase(all_loan_requests.fulfilled, (state, action) => {
        state.LoanRequestAll.loading = false;
        if (action.payload.error) {
          state.LoanRequestAll.error = action.payload.message;
        }
        state.LoanRequestAll.data = action.payload.data;
        state.LoanRequestAll.total_count = action.payload.data.total_count;
        state.LoanRequestAll.success = action.payload.message;
      })
      .addCase(all_loan_requests.rejected, (state, action) => {
        state.LoanRequestAll.loading = false;
        state.LoanRequestAll.error = action.payload as string;
      })
      .addCase(_loan_request_trend.pending, (state) => {
        state.loan_request_trend.loading = true;
        state.loan_request_trend.error = null;
      })
      .addCase(_loan_request_trend.fulfilled, (state, action) => {
        state.loan_request_trend.loading = false;
        if (action.payload.error) {
          state.loan_request_trend.error = action.payload.message;
        }
        state.loan_request_trend.data = action.payload.data;
        state.loan_request_trend.success = action.payload.message;
      })
      .addCase(_loan_request_trend.rejected, (state, action) => {
        state.loan_request_trend.loading = false;
        state.loan_request_trend.error = action.payload as string;
      })
      .addCase(_single_loan_products_request.pending, (state) => {
        state.single_loan_products_request.loading = true;
        state.single_loan_products_request.error = null;
      })
     .addCase(_single_loan_products_request.fulfilled, (state, action) => {
  state.single_loan_products_request.loading = false;
  if (action.payload.error) {
    state.single_loan_products_request.error = action.payload.message;
  }
  state.single_loan_products_request.data = action.payload.data;
  state.single_loan_products_request.success = action.payload.message;
  
  // Safely access nested properties
  state.single_loan_products_request.user_info_status = 
    action.payload.data?.loan?.request_details?.user_info_status ?? null;
})
      .addCase(_single_loan_products_request.rejected, (state, action) => {
        state.single_loan_products_request.loading = false;
        state.single_loan_products_request.error = action.payload as string;
      });
  },
});

export const {
  resetLoanRequestStatSuccess,
  resetLoanRequestAllSuccess,
  resetLoanRequestTrendSuccess,
  resetSingleLoanProductsRequestSuccess,
} = loanRequestSlice.actions;

export default loanRequestSlice.reducer;
