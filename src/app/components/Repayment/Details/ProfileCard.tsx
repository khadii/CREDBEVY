"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDashboard } from "@/app/Context/DahboardContext";
import { CSSProperties } from "react";
import { RootState } from "@/app/Redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function ProfileCard({ id }: { id: any }) {
  const { data, loading, error } = useSelector((state: RootState) => state.sinleloanRepayment);
  

  // Get user data from Redux store or use fallback if not available
  const user = data?.user_information || {
    firstname: "",
    lastname: "",
    date_of_birth: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "",
    gender: "",
    selfie: "",
    credit_score: null
  };

  const fullName = `${user.firstname} ${user.lastname}`;
  const credit_score = user.credit_score || 0;

  // Format date of birth
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
    ];
  };

  const userData = getUserData();

   if (loading || !userData)  {
    return (
      <div className="pt-[34px] bg-white rounded-lg h-[1100px] w-full border-[1px] p-6">
       
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFFFFF] flex flex-col items-center rounded-lg text-center h-[1100px] border-[1px] justify-center">
        <div>Error loading user data: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-center rounded-lg text-center h-[1100px] border-[1px]">
      {/* Profile Image */}
      <Image
        src={
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${user?.firstname || "U"}${user?.lastname ? `+${user.lastname}` :user?.selfie}`
          )}&background=random`
        }
        alt={`${user?.firstname || "User"}'s avatar`}
        width={96}
        height={96}
        className="w-24 h-24 mx-auto mb-4 mt-[48px] rounded-full"
        unoptimized={true}
        onError={(e) => {
          e.currentTarget.src =
            "https://ui-avatars.com/api/?name=User&background=random";
        }}
      />
      
      {/* Name */}
    <h2 className="text-2xl font-semibold text-[#333333] max-w-72 break-words">
  {fullName}
</h2>


      {/* Buttons */}
      <div className="mt-6 grid justify-center gap-2">
        {/* <div className="w-[83px] h-[23px] rounded-[16px] border border-solid pt-[2px] pr-[8px] pb-[2px] pl-[6px] flex justify-center items-center text-xs font-semibold text-[#42BE65] border-[#BFFFD1]">
          <Image 
            src="/Image/appproveddot.svg" 
            alt="Approved icon" 
            height={8} 
            width={8} 
            className="mr-1" 
          />
          Repaid
        </div> */}
      </div>

      {/* Credit Score */}
      <p className="mt-[32px] text-[12px] font-bold text-[#8A8B9F]">
        Credit Score
      </p>
      <p className={`text-[32px] font-bold ${getCreditRating(credit_score).color}`}>{credit_score}</p>

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


const getCreditRating = (score: number): { text: string; color: string } => {
  if (score >= 800) return { text: "Excellent", color: "text-emerald-500" };
  if (score >= 740) return { text: "Very Good", color: "text-emerald-500" };
  if (score >= 670) return { text: "Good", color: "text-emerald-500" };
  if (score >= 580) return { text: "Fair", color: "text-yellow-500" };
  return { text: "Poor", color: "text-red-500" };
};
