"use client";
import { useDashboard } from '@/app/Context/DahboardContext';
import { _single_loan_products_request } from '@/app/Redux/Loan_request/loan_request_thunk';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function LoanModal({open, setOpen, setState,titleName,buttonName}: {open: any, setOpen: any, setState: any, titleName: string;
  buttonName: string}) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedIds } = useDashboard();
  
  const {
    loading: LoanRequest_loading,
    data: LoanRequest_Data,
  } = useSelector((state: RootState) => state.loanRequest.single_loan_products_request);

  // useEffect(() => {
  //   if (open && selectedIds && selectedIds.length > 0) {
  //     // dispatch(_single_loan_products_request({ id: selectedIds }));
  //   }
  // }, [dispatch, selectedIds, open]);

  if (!open) return null;

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCreditRating = (score: number) => {
    if (score >= 800) return { text: "Excellent", color: "text-emerald-500" };
    if (score >= 740) return { text: "Very Good", color: "text-emerald-400" };
    if (score >= 670) return { text: "Good", color: "text-emerald-300" };
    if (score >= 580) return { text: "Fair", color: "text-yellow-500" };
    return { text: "Poor", color: "text-red-500" };
  };
  const creditScore = LoanRequest_Data?.loan?.user?.credit_score || null;
  const rating = creditScore ? getCreditRating(creditScore) : { text: "N/A", color: "text-gray-500" };
    
  // Data rows configuration
  const dataRows = [
    { 
      label: 'Name:', 
      value:   LoanRequest_Data?.loan?.user?.first_name || 'N/A'
    },
    { 
      label: 'Credit Score:', 
      value:  <span className={`${rating.color} font-semibold text-base ml-2`}>
      {creditScore || 'N/A'}
    </span>
    },
    { 
      label: 'Monthly Income:', 
      value: formatCurrency(LoanRequest_Data?.loan?.employment_info?.monthly_income || 0) 
    },
    { 
      label: 'Loan Amount:', 
      value: formatCurrency(LoanRequest_Data?.loan?.request_details?.loan_amount || 0) 
    },
    { 
      label: 'Monthly Repayment:', 
      value: formatCurrency(LoanRequest_Data?.loan?.request_details?.monthly_repayment || 0) 
    },
    { 
      label: 'Loan Purpose:', 
      value: LoanRequest_Data?.loan?.request_details?.loan_purpose || 'N/A' 
    },
    { 
      label: 'Loan Tenure:', 
      value: LoanRequest_Data?.loan?.request_details?.loan_duration ? 
        `${LoanRequest_Data?.loan.request_details.loan_duration} Months` : 'N/A' 
    },
    { 
      label: 'Interest Rate:', 
      value: LoanRequest_Data?.loan?.request_details?.interest_rate ? 
        `${LoanRequest_Data?.loan.request_details.interest_rate}%` : 'N/A' 
    },
    { 
      label: 'Request Date:', 
      value: formatDate(LoanRequest_Data?.loan?.request_details?.created_at) 
    },
    { 
      label: 'Loan Product:', 
      value: LoanRequest_Data?.loan?.request_details?.loan_product_name || 'N/A' 
    },
    { 
      label: 'Status:', 
      value: LoanRequest_Data?.loan?.request_details?.status || 'N/A' 
    },
    {
      label: 'Fees:',
      value: titleName === 'Indicate Interest'
        ?<span className='text-base text-[#156064] font-semibold'>{( formatCurrency(LoanRequest_Data?.loan?.partner_info?.indication_of_interest_expense_fee || 0))}</span> 
        :<span className='text-base text-[#156064] font-semibold'>{ ( formatCurrency(LoanRequest_Data?.loan?.partner_info?.approval_expense_fee || 0))}</span>
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-0">
      <div className="w-full max-w-[544px] max-h-[80vh] sm:max-h-[675px] overflow-y-auto bg-white rounded-[8px] px-6 pt-[28px] pb-[40px]">
        <div className="flex items-center justify-between mb-[50px]">
          <h2 className="text-2xl font-semibold text-[#333333]">{titleName}</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-[#333333] px-2 rounded-[4px] border font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {LoanRequest_loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading loan details...</p>
          </div>
        ) : (
          <div className="xl:space-y-4 space-y-2">
            {dataRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 sm:gap-[186px]">
                <div className="text-[#8A8B9F] text-sm text-left">{row.label}</div>
                <div className="text-sm text-[#8A8B9F] text-right sm:text-right">{row.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-12 gap-4 mt-[44px]">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-[10px] sm:px-[81px] border border-[#333333] rounded-[4px] text-[12px] font-bold text-[#333333]"
          >
            Cancel
          </button>
          <button
            onClick={() => setState(2)}
            className="px-4 py-[10px] sm:px-[50px] border border-[#156064] bg-[#156064] rounded-[4px] text-[12px] font-bold text-white"
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
}