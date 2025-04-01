"use client";
import { useDashboard } from "@/app/Context/DahboardContext";
import { _single_loan_products_request, accept_interest, approve_loan, reject_loan } from "@/app/Redux/Loan_request/loan_request_thunk";
import { resetPinState } from "@/app/Redux/pin/pinkslice";
import { ConfirmPin } from "@/app/Redux/pin/pinthunk";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ErrorsState {
  pin?: string;
}

const PinModal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
}) => {
  const { authPin, setAuhPin, selectedIds, refreshData, setInterested, refreshSingle } = useDashboard();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<ErrorsState>({});
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [borderRed, setBorderRed] = useState(false);
  const [refreshid, setrefreshid] = useState<ErrorsState>();
  const {
    loading: pinLoading,
    success: pinSuccess,
    error: pinError,
    message: pinMessage
  } = useSelector((state: RootState) => state.Pin.ConfirmPin);

  const {
    rejectLoading,
  rejectSuccess,
  rejectError,
  rejectData,
  } = useSelector((state: RootState) => state.loanCondition);

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




  const resetAll = () => {
    setPin(["", "", "", ""]);
    setErrors({});
    setBorderRed(false);
    dispatch(resetPinState());
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  // useEffect(() => {
  //   if (rejectSuccess) {
  //     toast.success(rejectData.message);
  //     onClose();
  //     resetAll();
  //   }
  //   if (rejectError) {
  //     toast.error(rejectError);
  //     resetAll();
  //     onClose();
  //   }
  // }, [rejectSuccess, rejectError, rejectData, dispatch]);

  useEffect(() => {
    if (pinSuccess) {
      toast.success(pinMessage);
      resetAll();
    }
    if (pinError) {
      toast.error(pinError);
      setBorderRed(true);
      dispatch(resetPinState());
    }
  }, [pinSuccess, pinError, pinMessage, dispatch]);

  const handleChange = (index: number, value: string) => {
    if (errors.pin) {
      setErrors({});
    }
    if (!/^\d?$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const validate = (): boolean => {
    const newErrors: ErrorsState = {};
    const emptyIndex = pin.findIndex(digit => digit === "");
    
    if (emptyIndex !== -1) {
      newErrors.pin = "Please complete the PIN";
      inputRefs.current[emptyIndex]?.focus();
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    try {
      const pinPayload = {
        pin: pin.map(digit => Number(digit))
      };
      
      const pinResult = await dispatch(ConfirmPin(pinPayload));
      
      if (pinResult.meta.requestStatus === 'fulfilled') {
        setAuhPin(pinPayload.pin);
        
        const currentRequestParams = {
          product_id: [selectedIds],
          pin: pinPayload.pin
        };
  
        const interestResult = await dispatch(reject_loan(currentRequestParams));
        
        // Check the response structure
        if (interestResult.meta.requestStatus === 'fulfilled') {
          const response = interestResult.payload as {
            error: boolean;
            message: string;
            data: any;
          };
  
          const productData = getProductCookie();
          dispatch(_single_loan_products_request({ id: productData }));
          
          if (response.error) {
            toast.error(response.message);
          } else {
            toast.success(response.message || "Operation completed successfully");
          }
          
          onClose();
          setInterested(true);
        }
        
        if (interestResult.meta.requestStatus === 'rejected') {
          const response = interestResult.payload as {
            error: boolean;
            message: string;
            data: any;
          } || {
            error: true,
            message: "Request failed"
          };
  
          const productData = getProductCookie();
          toast.error(response.message);
          dispatch(_single_loan_products_request({ id: productData }));
          setInterested(true);
          onClose();
        }
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to process request'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17191CBA]">
      <div className="relative bg-white rounded-lg">
        {rejectLoading ? (
          <div className="p-[24px] flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-[#333333] mb-4">
              updating Getting details...
            </p>
          </div>
        ) : (
          <>
            <div className="flex pl-[24px] pt-[24px] pr-[15px] justify-between w-full items-center">
              <h2 className="text-[24px] font-bold text-[#333333]">
                Decline Request
              </h2>
              <button
                onClick={handleClose}
                className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-[24px] mt-[127px]">
              <div className="w-full justify-center items-center flex">
                <div className="w-full">
                  <p className="text-[16px] font-bold text-[#333333] mb-[24px] text-center">
                    Input your transaction PIN to process request
                  </p>

                  <div className="flex justify-center space-x-6">
                    {pin.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) {
                            inputRefs.current[index] = el;
                          }
                        }}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={`w-[80px] h-[80px] border-[4px] ${errors.pin && digit === ""
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#156064] focus:ring-[#156064]"} rounded-[8px] focus:outline-none focus:ring-2 text-center text-[40px] font-bold mb-[134px]`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {errors.pin && (
                <p className="text-red-500 mb-4 text-center">{errors.pin}</p>
              )}

              <div className="flex space-x-[96px] justify-center">
                <button
                  onClick={handleClose}
                  className="px-[81px] py-[10px] border border-[#333333] rounded-[4px] text-[12px] font-bold text-[#333333]"
                >
                  Cancel
                </button>
                <button
                  className="px-[81px] py-[10px] border border-[#156064] bg-[#156064] rounded-[4px] text-[12px] font-bold text-white"
                  onClick={handleSubmit}
                  disabled={pinLoading || rejectLoading}
                >
                  {pinLoading || rejectLoading ? "Processing..." : "Done"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PinModal;