
'use client'

import React, { useEffect } from "react";
import ProfileCard from "./ProfileCard";
import Layout from "../Layout/Layout";
import FinancialInfo from "./FinancialInfo";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { _single_loan_products_request } from "@/app/Redux/Loan_request/loan_request_thunk";
import SpinningFaceExact from "../credbevyLoader";
import AnimatedLoader from "../animation";
import ErrorDisplay from "../ErrorDisplay";

export default function Loandetails({id}:{id:any}) {

  const {
    loading:LoanRequest_loading,
    data: LoanRequest_Data,
    error
  } = useSelector((state: RootState) => state.loanRequest.single_loan_products_request);

  return (
    <Layout>
      {error?<ErrorDisplay error={error}/>:LoanRequest_loading?  <AnimatedLoader isLoading={LoanRequest_loading}></AnimatedLoader>:<div className="w-full bg-[#FAFAFA] pb-[60px] flex flex-col  h-full ">
        <div><p className="mb-[32px] text-[34px] font-bold">Loan Request Details</p></div>
      <div className="w-full flex gap-6 ">
      <div className="md:w-[32%] w-full ">
          <ProfileCard id={id} />
        </div>
        <div className="w-[68%] ">
          {" "}
          <FinancialInfo id={id} />
        </div>
      </div>
        <AnimatedLoader isLoading={LoanRequest_loading}></AnimatedLoader>
      </div>}
      
    </Layout>
  );
}



