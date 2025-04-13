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
import securityReducer from'../Redux/company_info/security&password';
import userManagementReducer from'../Redux/user_management/user_management_slice';
import updateLoanReducer from'../Redux/Loan_Product/updateLoanProductSlice';
import loanProductSingleReducer from'../Redux/Loan_Product/loanProductSingleSlice';
import updateUsersReducer from'../Redux/user_management/Update_user_slice';
import userSliceReducer from'../Redux/user_management/singleuser_slice';
import delete_userReducer from '../Redux/user_management/delete_user'
import adduserReducer from '../Redux/user_management/add_user_slice'
import userRolesReducer from '../Redux/Userr_Role/Get_All_User_Role'
import deleteUserroleReducer from '../Redux/Userr_Role/delete_user_role'
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
    security:securityReducer,
    userManagement:userManagementReducer,
    updateLoan: updateLoanReducer,
    loanProductSingle: loanProductSingleReducer,
    updateUsers: updateUsersReducer,
    singleUser: userSliceReducer,
    delete_user:delete_userReducer,
    adduser: adduserReducer,
    userRoles:userRolesReducer,
    deleteUserrole:deleteUserroleReducer
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

