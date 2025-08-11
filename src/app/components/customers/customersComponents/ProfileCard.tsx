"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDashboard } from "@/app/Context/DahboardContext";
import { CSSProperties } from "react";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { clearLoanRequest, fetchSingleLoanRequest } from "@/app/Redux/customer/fetchSingleLoanRequest";
import { GoDotFill } from "react-icons/go";



export default function ProfileCardCustomrs({ id }: { id: any }) {
 const dispatch = useDispatch<AppDispatch>();
  const { data: loanRequest, loading, error } = useSelector((state: RootState) => state.customerpersoninfo);

  // useEffect(() => {
  //  if (id) {
  //     dispatch(fetchSingleLoanRequest(id));
  //   }

  //   return () => {
  //     dispatch(clearLoanRequest());
  //   };
  // }, [id, dispatch]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error}</div>;
  }

  if (!loanRequest) {
    return <div>No user data available</div>;
  }

  const user = loanRequest.user;
  const fullName = `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`;
  const credit_score = user.credit_score || 0;

  // Format date of birth
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString; // Return as-is if parsing fails
    }
  };

  // Create user data from API response
  const getUserData = () => {
    return [
      { label: "Date of Birth", value: formatDateOfBirth(user.date_of_birth) },
      { label: "Email", value: user.email || "N/A" },
      { label: "Phone", value: user.phone || "N/A" },
      { label: "Address", value: user.address || "N/A" },
      { label: "State", value: user.state || "N/A" },
      { label: "Country", value: user.country || "N/A" },
      { label: "Gender", value: user.gender || "N/A" },
      { 
        label: "Status", 
        value: loanRequest.request_details.status || "N/A" 
      },
    ];
  };

  const userData = getUserData();

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-center rounded-lg text-center h-[1100px] border-[1px]">
      {/* Profile Image */}
      {user.selfie_base_image_64 ? (
        <img 
          src={`data:image/jpeg;base64,${user.selfie_base_image_64}`}
          alt={`${user.first_name}'s profile`}
          className="w-24 h-24 mx-auto mb-4 mt-[48px] rounded-full object-cover"
        />
      ) : (
        <Image
          src={
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${user.first_name || "U"}${user.last_name ? `+${user.last_name}` : ""}`
            )}&background=random`
          }
          alt={`${user.first_name || "User"}'s avatar`}
          width={96}
          height={96}
          className="w-24 h-24 mx-auto mb-4 mt-[48px] rounded-full"
          unoptimized={true}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://ui-avatars.com/api/?name=User&background=random";
          }}
        />
      )}
      
      {/* Name */}
  <h2 className="text-2xl font-semibold text-[#333333] max-w-72 break-words">
  {fullName}
</h2>


      {/* Status Button */}
      <div className="mt-6 grid justify-center gap-2">
        <div className={`w-[83px] h-[23px] rounded-[16px] border border-solid pt-[2px] pr-[8px] pb-[2px] pl-[6px] flex justify-center items-center text-xs font-semibold ${
          loanRequest.request_details.approval_status === 'APPROVED' 
            ? 'text-[#42BE65] border-[#BFFFD1]' 
            : loanRequest.request_details.approval_status === 'REJECTED'
            ? 'text-[#FF4D4F] border-[#FFCCC7]'
            : 'text-[#FAAD14] border-[#FFF7E6]'
        }`}>
          {loanRequest.request_details.approval_status === 'APPROVED' || loanRequest.request_details.approval_status === 'APPROVED' ? (
            <>
             <GoDotFill size={24} className="mr-1" />
              {'repaid'}
            </>
          ) : loanRequest.request_details.approval_status === 'REJECTED' || loanRequest.request_details.approval_status === 'REJECTED' ? (
            <>
             <GoDotFill size={24} className="mr-1" />
              {'defaulted'}
            </>
          ) : (
            <>
             <GoDotFill size={24} className="mr-1" />
              {'Pending'}
            </>
          )}
        </div>
      </div>

      {/* Credit Score */}
      <p className="mt-[32px] text-[12px] font-bold text-[#8A8B9F]">
        Credit Score
      </p>
      <p className="text-[32px] font-bold text-[#42BE65]">{credit_score}</p>

      {/* User Details */}
      <div className="w-full space-y-5 mt-[38px] flex flex-col items-center justify-center px-[23px]">
        {userData.map((item, index) => (
          <div
            key={index}
            className="flex w-full text-[12px] font-medium text-[#8A8B9F] text-left gap-[38px] items-center"
          >
            <div className="w-[73px]">{item.label}:</div>
            <div className="text-left truncate w-[225px] text-pretty break-words">
              <p className={item.label === "Email" ? "break-words" : ""}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}