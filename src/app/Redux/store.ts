// store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../Redux/auth/authSlice'
import walletReducer from '../Redux/dashboard/dashboardSlice';
import loanProductReducer from'../Redux/Loan_Product/loan_product_slice';
import loanProductsTableReducer from'../Redux/Loan_Product/loanProductTableSlice';
import bulkActionReducer from'../Redux/Loan_Product/Bulkslice';
import loanRequestReducer from'../Redux/Loan_request/loan_request_slice.';
import pinReducer from'../Redux/pin/pinkslice';
import loanInterestReducer from'../Redux/Loan_request/loanInterestSlice';
import loanConditionReducer from'../Redux/Loan_request/loanConditon';
import loanrejectacceptReducer from'../Redux/Loan_request/loanInterestSlice';
import CompanyInfoReducer from'../Redux/company_info/company_info_slice';
import CompanyInfoFormReducer from'../Redux/company_info/company_info_form_slice';
import notificationReducer from'../Redux/company_info/notificationSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    loanProduct: loanProductReducer,
    loanProductsTable: loanProductsTableReducer,
    bulkAction: bulkActionReducer,
    loanRequest: loanRequestReducer,
    Pin:pinReducer,
    loanInterest:loanInterestReducer,
    loanCondition:loanConditionReducer,
    loanrejectaccept:loanrejectacceptReducer,
    companyInfo: CompanyInfoReducer,
    CompanyInfoForm: CompanyInfoFormReducer,
    notification: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

