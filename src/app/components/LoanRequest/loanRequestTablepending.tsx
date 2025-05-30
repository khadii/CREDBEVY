import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LucideChevronDown, ChevronLeft, ChevronRight, Check, LucideThumbsUp, LucideThumbsDown } from "lucide-react";
import { FaCircle } from "react-icons/fa";
import { CustomCheckbox } from "../CheckboxForTable/TablecheckBox";
import { useDashboard } from "@/app/Context/DahboardContext";
import TableWithPagination from "../table/tablewWthPagination";
import ApproveRequest from "../Modals/ApproveRequest";
import DeclineRequest from "../Modals/DeclineRequest";
import Modal from "../Modals/indicateInterest";
import TableWithOutPagination from "../table/tableWithOutPagination";

interface TableProps<T> {
  headers: string[];
  data: T[];
  titleProps: {
    mainTitle: string;
    count: string;
    subtitle: string;
  };
  href: string;
  itemsPerPage: number;
  renderStatus?: (status: string) => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
}

interface LoanData {
  id: string; 
  first_name: string;
  last_name: string;
  average_income: string;
  amount_requested: string;
  credit_score: string;
  interest_rate: string;
  loan_duration: string;
  image?: string; 
  loan_uuid: string; 
  info_status: any;
}

export const LoanRequestWithPagination = ({ bulkAction, laon_table_data_all, setCurrentPage, currentPage, totalPages, total_count }: { laon_table_data_all: any, setCurrentPage: any, currentPage: any, totalPages: any, total_count: any, bulkAction: any }) => {
  const loanHeaders = [
    "Name",
    "Average Income",
    "Amount Requested",
    "C.S",
    "I.R",
    "Duration",
    "Quick Actions"
  ];

  const titleProps = {
    mainTitle: "Pending Loan request",
    count: total_count + " request",
    subtitle: "Loans awaiting a decision "
  };
 
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const { selectedIds, setSelectedIds } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenApproveRequest, setIsModalOpenApproveRequest] = useState(false);
  const [isModalOpenDeclineRequest, setIsModalOpenDeclineRequest] = useState(false);

  useEffect(() => {
    if (laon_table_data_all && laon_table_data_all.length > 0) {
      setSelectedIds([]);
    }
  }, [laon_table_data_all]);

  useEffect(() => {
    if (selectedIds.length === laon_table_data_all?.length) {
      setIsHeaderChecked(true);
    } else {
      setIsHeaderChecked(false);
    }
  }, [selectedIds, laon_table_data_all]);

  
  const handleToggle = (id: string) => {
    setSelectedIds((prevSelectedIds: any) => {
      // Ensure prevSelectedIds is an array
      const currentIds = Array.isArray(prevSelectedIds) ? prevSelectedIds : [];
      
      if (currentIds.includes(id)) {
        return currentIds.filter(selectedId => selectedId !== id);
      } else {
        return [...currentIds, id];
      }
    });
  };


  const handleHeaderToggle = () => {
    const newHeaderState = !isHeaderChecked;
    setIsHeaderChecked(newHeaderState);

    if (newHeaderState) {
      const allloan_uuids = laon_table_data_all.map((item: LoanData) => item.loan_uuid);
      setSelectedIds(allloan_uuids);
    } else {
      setSelectedIds([]);
    }
  };

  const renderHeader = (isHeaderChecked: boolean, handleHeaderToggle: () => void) => (
    <CustomCheckbox id={-1} checked={isHeaderChecked} onChange={handleHeaderToggle} />
  );

  const renderRow = useCallback((item: LoanData, index: number) => (
    <>
      <td className="pl-[27px] py-4 px-6">
        <div className="flex items-center gap-4 h-full">
     <div   onClick={(e) => e.stopPropagation()}>
           <CustomCheckbox
            id={item.loan_uuid}
            checked={selectedIds.includes(item.loan_uuid)}
            onChange={() => handleToggle(item.loan_uuid)}
          />
     </div>
          {item.image && (
            <img
              src={item.image} 
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <p className="truncate max-w-[140px]">{`${item.first_name} ${item.last_name}`}</p>
        </div>
      </td>
      <td className="truncate max-w-[120px] py-4 px-6">
        {item.average_income}
      </td>
      <td className="truncate max-w-[120px] py-4 px-6">
        {item.amount_requested}
      </td>
      <td className="truncate max-w-[75px] py-4 px-6">
        {item.credit_score}
      </td>
      <td className="truncate max-w-[85px] py-4 px-6">
        {item.interest_rate}
      </td>
      <td className="truncate max-w-[110px] py-4 px-6">
        {item.loan_duration}
      </td>
      <td className="truncate max-w-[154px] py-4 px-6">
        {item.info_status === "INTERESTED" && (
          <button className="flex items-center border border-[#BFFFD1] text-[#42BE65] bg-[#EFFAF2] px-2 h-[23px] rounded-full text-xs font-semibold">
            <FaCircle className="text-[#42BE65] w-2 h-2 mr-1" />
            Interested
          </button>
        )}
        {item.info_status === "NOT_INTERESTED" && (
          <button className="flex items-center gap-2 border border-[#FFBAB1] text-[#E33A24] bg-[#FFF3F1] px-2 h-[23px] rounded-full text-xs font-semibold">
            <FaCircle className="text-[#E33A24] w-2 h-2 mr-1" />
            Not interested
          </button>
        )}
        {!item.info_status && (
          <div className="flex w-full gap-[27px]">
            <LucideThumbsUp
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
              size={24}
              className="text-[#067647] cursor-pointer"
            />
            <LucideThumbsDown
              onClick={(e) => { e.stopPropagation(); setIsModalOpenDeclineRequest(true); }}
              size={24}
              className="text-[#B42318] cursor-pointer"
            />
          </div>
        )}
      </td>
    </>
  ), [selectedIds, handleToggle]);

  return (
    <>
      <TableWithPagination
        headers={loanHeaders}
        data={laon_table_data_all}
        titleProps={titleProps}
         href="/dashboard/loan-request/details"
        renderRow={renderRow}
        renderHeader={renderHeader}
        isHeaderChecked={isHeaderChecked}
        handleHeaderToggle={handleHeaderToggle}
        showAddProductButton={false}
        bulkAction={bulkAction}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <ApproveRequest
        isOpen={isModalOpenApproveRequest}
        onClose={() => setIsModalOpenApproveRequest(false)}
      />
      <DeclineRequest
        isOpen={isModalOpenDeclineRequest}
        onClose={() => setIsModalOpenDeclineRequest(false)}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
       
      />
    </>
  );
};