"use client";
import { useDashboard } from "@/app/Context/DahboardContext";
import { _single_loan_products_request, decline_interest } from "@/app/Redux/Loan_request/loan_request_thunk";
import { AppDispatch, RootState } from "@/app/Redux/store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AnimatedLoader from "../animation";
import { _pending_loans } from "@/app/Redux/dashboard/dashboardThunk";

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
  useEffect(() => {
    if (declineSuccess) {
      toast.success(declineData?.message || 'Request declined successfully');
      refreshData();
      setInterested(false);
      handleClose();
         dispatch(_pending_loans({
  search: "",
  min_amount: "",
  max_amount: "",
  start_date: ""
}));
    }
    if (declineError) {
      toast.error(declineError);
      handleClose();
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
      
        // Success handling moved to useEffect to ensure consistent behavior
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17191CBA] p-4 sm:p-0">
      <div className="relative bg-white rounded-lg w-full max-w-[500px] sm:w-auto sm:max-w-none">
        {LoanRequest_loading ? (
          <AnimatedLoader isLoading={LoanRequest_loading}></AnimatedLoader>
        ) : (
          <>
            <div className="flex pl-[24px] pt-[24px] pr-[15px] justify-between w-full items-center">
              <h2 className="text-[24px] font-semibold text-[#333333]">
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

            <div className="p-[24px] mt-[98px]">
              <div className="w-full justify-center items-center">
                <div className="w-full flex justify-center mb-[24px]">
                  <img
                    src="/Image/close-circle.svg"
                    alt="Decline icon"
                    className="w-[88px] h-[88px] object-cover items-center justify-center"
                  />
                </div>
                <div className="w-full">
                  <p className="text-[24px] font-semibold text-[#333333] mb-[24px] text-center">
                    Are you sure you want to decline this offer?
                  </p>
                  <h1 className="mb-[105px] text-center text-[#8A8B9F] text-[14px] font-semibold">
                    A loan request of {formatCurrency(LoanRequest_Data?.loan.request_details.loan_amount)} from a user with CS OF <span className="text-[#42BE65]">{LoanRequest_Data?.loan.user.credit_score}</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-[96px] space-y-4 sm:space-y-0">
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