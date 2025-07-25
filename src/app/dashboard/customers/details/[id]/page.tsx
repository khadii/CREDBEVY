import Loandetails from "@/app/components/LoanDetials/Loandetails";
import RepaymentDetails from "@/app/components/Repayment/Details/RepaymentDetails";
import { _single_loan_products_request } from "@/app/Redux/Loan_request/loan_request_thunk";

import React from "react";
import Details from "../../details";

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const product_id = {
    id: id,
  };

  return (
    <div>
      {" "}
      <Details id={id} />
    </div>
  );
}
