"use client";
import { useDashboard } from "@/app/Context/DahboardContext";
import { _single_loan_products_request, decline_interest } from "@/app/Redux/Loan_request/loan_request_thunk";
import { AppDispatch, RootState } from "@/app/Redux/store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AnimatedLoader from "../animation";
import { _pending_loans } from "@/app/Redux/dashboard/dashboardThunk";
import { resetDeclineState } from "@/app/Redux/Loan_request/loanInterestSlice";
import Cookies from "js-cookie";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeclineRequest: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { selectedIds, refreshData, setInterested } = useDashboard();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    declineLoading,
    declineSuccess,
    declineError,
    declineData 
  } = useSelector((state: RootState) => state.loanrejectaccept);
  
  const {
    loading: LoanRequest_loading,
    error: LoanRequest_SuccessError,
    data: LoanRequest_Data,
    user_info_status
  } = useSelector((state: RootState) => state.loanRequest.single_loan_products_request);

  // useEffect(() => {
  //   const currentRequestParams = {
  //     id: [selectedIds],
  //   };
  //   if (isOpen) {
  //     dispatch(_single_loan_products_request(currentRequestParams));
  //   }
  // }, [isOpen, selectedIds, dispatch]);

  // Reset state when modal closes or when operations complete

    const getProductCookie = () => {
    try {
      const productCookie = Cookies.get("product_id");
      if (!productCookie) return null;
      if (typeof productCookie === 'object') return productCookie;
      if (!productCookie.startsWith("{")) return productCookie;
      return JSON.parse(productCookie);
    } catch (error) {
      console.error("Failed to parse product cookie:", error);
      Cookies.remove("product_id");
      return null;
    }
  };
  useEffect(() => {
    if (declineSuccess) {
      toast.success(declineData?.message || 'Request declined successfully');
      refreshData();
      setInterested(false);
      handleClose();
         const productData = getProductCookie();
       dispatch(_single_loan_products_request({ id: productData }));
      dispatch(_pending_loans({
        search: "",
        min_amount: "",
        max_amount: "",
        start_date: ""
      }));
    }
          dispatch(resetDeclineState())
    if (declineError) {
      toast.error(declineError);
      handleClose();
          dispatch(resetDeclineState())
      dispatch(_single_loan_products_request(selectedIds));
    }
  }, [declineSuccess, declineError, declineData]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;
      
  const handleSubmit = async () => {
    try {
      const currentRequestParams = {
        product_id: [selectedIds],
      };
      
      const notinterestResult = await dispatch(decline_interest(currentRequestParams));
      
      if (notinterestResult.meta.requestStatus === 'fulfilled') {
    
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process request');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('NGN', 'N');
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17191CBA] p-4">
      <div className="relative bg-white rounded-lg w-full max-w-2xl sm:max-w-xl">
        {LoanRequest_loading ? (
          <AnimatedLoader isLoading={LoanRequest_loading}></AnimatedLoader>
        ) : (
          <>
            <div className="flex px-4 sm:pl-[24px] pt-[24px] sm:pr-[15px] justify-between w-full items-center">
              <h2 className="text-lg sm:text-[24px] font-semibold text-[#333333]">
                Decline Request
              </h2>
              <button 
                onClick={handleClose} 
                className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
                disabled={LoanRequest_loading || declineLoading}
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-[24px] mt-12 sm:mt-[98px]">
              <div className="w-full justify-center items-center">
                <div className="w-full flex justify-center mb-6 sm:mb-[24px]">
                  <img
                    src="/Image/close-circle.svg"
                    alt="Decline icon"
                    className="w-16 h-16 sm:w-[88px] sm:h-[88px] object-cover items-center justify-center"
                  />
                </div>
                <div className="w-full">
                  <p className="text-xl sm:text-[24px] font-semibold text-[#333333] mb-6 sm:mb-[24px] text-center px-2">
                    Are you sure you want to decline this offer?
                  </p>
                  <h1 className="mb-12 sm:mb-[105px] text-center text-[#8A8B9F] text-sm sm:text-[14px] font-semibold px-2">
                    A loan request of {formatCurrency(LoanRequest_Data?.loan.request_details.loan_amount)} from a user with CS OF <span className={`${getCreditRating(LoanRequest_Data?.loan.user.credit_score).color}`}>{LoanRequest_Data?.loan.user.credit_score}</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-col md:flex-row  space-y-4 md:space-y-0 justify-between">
                <button
                  onClick={handleClose}
                  disabled={LoanRequest_loading || declineLoading}
                  className="px-[81px] py-[10px] border border-[#333333] rounded-[4px] text-[12px] font-bold text-[#333333] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={LoanRequest_loading || declineLoading}
                  className="px-[81px] py-[10px] border border-[#FA4D56] bg-[#FA4D56] rounded-[4px] text-[12px] font-bold text-white disabled:opacity-50"
                >
                  {declineLoading ? 'Processing...' : 'Decline'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeclineRequest;



const getCreditRating = (score: number): { text: string; color: string } => {
  if (score >= 800) return { text: "Excellent", color: "text-emerald-500" };
  if (score >= 740) return { text: "Very Good", color: "text-emerald-500" };
  if (score >= 670) return { text: "Good", color: "text-emerald-500" };
  if (score >= 580) return { text: "Fair", color: "text-yellow-500" };
  return { text: "Poor", color: "text-red-500" };
};
