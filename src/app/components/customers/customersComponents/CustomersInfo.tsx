"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { _single_loan_products_request } from "@/app/Redux/Loan_request/loan_request_thunk";
import { Tabs } from "../../Tabs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { formatDate } from "@/app/lib/formatdate";
import { single_loan_repayments } from "@/app/Redux/Repayment/repayment_thunk";
import { formatCurrency } from "@/app/lib/utillity/formatCurrency";
import Transaction_HistoryTable from "../../Repayment/Details/Transaction_HistoryTable";
import RepaymentScheduleTable from "./RepaymentScheduleTable";
import { fetchSingleLoanRequest } from "@/app/Redux/customer/fetchSingleLoanRequest";

interface RepaymentDetailsProps {
  id: string;
}

export default function RepaymentInfo({ id }: RepaymentDetailsProps) {
  const { data: repaymentData, loading: repaymentLoading, error: repaymentError } = useSelector(
    (state: RootState) => state.sinleloanRepayment
  );
  
  const { data: customerData, loading: customerLoading, error: customerError } = useSelector(
    (state: RootState) => state.customerpersoninfo
  );

  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   if (id) {
  //     dispatch(single_loan_repayments({ user_id: id }));
  //     dispatch(fetchSingleLoanRequest(id) as any);
  //   }
  // }, [dispatch, id]);

  const summary = repaymentData?.loan_summary || {
    loan_amount: 0,
    monthly_repayment: 0,
    loan_purpose: "",
    loan_terms: 0,
    interest_rate: 0,
    request_date: "",
    status: "",
    approval_status: "",
    total_repayment_count: 0,
    total_upcoming_count: 0,
    total_overdue_count: 0,
  };

  const tabs = useMemo(
    () => [
      { name: "Contact Info" },
      { name: "Financial Info" },
      { name: "Repayment" },
      { name: "Loans" },
      { name: "Credit Score" },
      { name: "Documents" },
      { name: "Communications" },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const FinancialInfo = useMemo(
    () => [
      {
        label: "Account Name:",
        value: customerData?.user 
          ? `${customerData.user.first_name} ${customerData.user.last_name}`
          : "N/A"
      },
      {
        label: "Account Number:",
        value: customerData?.financial_info?.payment_account_number || "N/A",
      },
      { 
        label: "Financial Institution:", 
        value: customerData?.financial_info?.payment_bank_name || "N/A" 
      },
      {
        label: "Monthly Income:",
        value: customerData?.employment_info 
          ? formatCurrency(customerData.employment_info.monthly_income)
          : "N/A"
      },
      {
        label: "BVN:",
        value: customerData?.financial_info?.bvn || "N/A"
      }
    ],
    [customerData]
  );
  
  const ContactInfo = useMemo(
    () => [
      {
        label: "Full Name:",
        value: customerData?.user 
          ? `${customerData.user.first_name} ${customerData.user.middle_name || ''} ${customerData.user.last_name}`
          : "N/A"
      },
      {
        label: "Customer ID:",
        value: customerData?.user?.user_uuid || "N/A"
      },
      { 
        label: "Phone Number:", 
        value: customerData?.user?.phone || "N/A" 
      },
      { 
        label: "Email Address:", 
        value: customerData?.user?.email || "N/A" 
      },
      { 
        label: "Date of Birth:", 
        value: customerData?.user?.date_of_birth 
          ? formatDate(customerData.user.date_of_birth) 
          : "N/A" 
      },
      { 
        label: "Employment:", 
        value: customerData?.employment_info?.employment_status || "N/A" 
      },
      { 
        label: "Current Employer:", 
        value: customerData?.employment_info?.current_employer || 
              customerData?.employment_info?.business_name || 
              "N/A" 
      },
      { 
        label: "Job Title:", 
        value: customerData?.employment_info?.job_role || "N/A" 
      },
      { 
        label: "Monthly Income:", 
        value: customerData?.employment_info 
          ? formatCurrency(customerData.employment_info.monthly_income)
          : "N/A" 
      }
    ],
    [customerData]
  );

  if (repaymentLoading || customerLoading) {
    return (
      <div className="pt-[34px] bg-white rounded-lg h-[1100px] w-full border-[1px] p-6">
        <div className="flex mb-[42px] pl-[24px]">
          {tabs.map((tab) => (
            <div key={tab.name} className="h-10 w-32 mr-4 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (repaymentError || customerError) {
    return (
      <div className="pt-[34px] bg-white rounded-lg h-[1100px] w-full border-[1px] p-6">
        <div className="text-red-500">
          Error loading data: {repaymentError || customerError}
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-[34px] bg-white rounded-lg h-[1100px] w-full border-[1px]`}>
      <div className="flex mb-[42px] pl-[24px]">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>

      {activeTab === "Repayment" && (
        <div className="w-full px-[24px]">
          <RepaymentScheduleTable />
        </div>
      )}

      {activeTab === "Credit Score" && (
        <div className="w-full px-[24px]">
          {/* <Transaction_HistoryTable
            LoanRequest_Data={repaymentData?.repayment_transaction_history.transactions!}
            totaltransaction={
              repaymentData?.repayment_transaction_history.total_transactions!
            }
          /> */}
        </div>
      )} 

      {activeTab === "Contact Info" && (
        <div className="w-full space-y-5 mt-[38px] flex flex-col items-center justify-center">
          {ContactInfo.map((item, index) => (
            <div
              key={index}
              className="flex w-full text-[16px] font-medium text-[#8A8B9F] text-left gap-[38px] pl-[24px] items-center"
            >
              <div className="w-[154px]">{item.label}</div>
              <div className="text-left truncate w-[300px] text-pretty break-words">
                <p className={item.label === "Email Address:" ? "break-words" : ""}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Financial Info" && (
        <div className="w-full space-y-5 mt-[38px] flex flex-col items-center justify-center">
          {FinancialInfo.map((item, index) => (
            <div
              key={index}
              className="flex w-full text-[16px] font-medium text-[#8A8B9F] text-left gap-[38px] pl-[24px] items-center"
            >
              <div className="w-[154px]">{item.label}</div>
              <div className="text-left truncate w-[300px] text-pretty break-words">
                <p className={item.label === "Email" ? "break-words" : ""}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}