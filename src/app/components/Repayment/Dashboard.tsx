"use client";

import React, { useEffect, useRef, useState } from "react";
import Repayment from "./Repayment";
import { CircleAlert } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { YearDropdown } from "../Yeardropdown";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  loan_repayment,
  loan_repayments_stats,
  loan_repayments_trend,
} from "@/app/Redux/Repayment/repayment_thunk";
import { formatCurrency } from "@/app/lib/utillity/formatCurrency";
import toast from "react-hot-toast";
import { useDashboard } from "@/app/Context/DahboardContext";
import { DropdownMenu } from "./activateDeActivateBulk";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useSelector(
    (state: any) => state.loanRepayment
  );
  const {
    data: datastat,
    loading: statloading,
    error: staterror,
  } = useSelector((state: RootState) => state.loanRepaymentsStats);
  const {
    data: datatrend,
    loading: trendloading,
    error: trenderror,
  } = useSelector((state: RootState) => state.loanRepaymentsTrend);



   const router = useRouter();

  useEffect(() => {
    if (error==='Unauthorized') {
      router.push("/")
    }
  }, [error, router])


  const [selectedYear, setSelectedYear] = useState("2025");
  const years = ["2022", "2023", "2024", "2025", "2026"];






  const params = {
    search: "",
    // single: false,
    sort_by: "DESC",
    start_date: "",
    end_date: "",
    status: "",
    approval_status: "",
    limit: 10,
    paginate: true,
    page: currentPage,
  };

  useEffect(() => {
    dispatch(loan_repayments_stats({ year: selectedYear }));
  }, [dispatch, selectedYear]);
  const lineChartDefaultSelectedYear = "This Year";
  const [linechartselectedYear, setlinechartSelectedYear] = React.useState(
    lineChartDefaultSelectedYear
  );

  useEffect(() => {
    dispatch(loan_repayments_trend({ year: linechartselectedYear }));
  }, [dispatch, linechartselectedYear]);

  useEffect(() => {
    dispatch(loan_repayment(params));
  }, [dispatch, currentPage]);

  const stats = [
    {
      title: "Total Loan Repaid",
      amount: datastat?.repaid?.amount
        ? formatCurrency(datastat.repaid.amount)
        : "N/A",
      change: datastat?.repaid?.amount_percentage ?? 0,
      percentage: datastat?.repaid?.amount_percentage ?? 0,
      icon: <TbCurrencyNaira size={"18px"} className="text-gray-500" />,
    },
    {
      title: "Total Upcoming Payment",
      amount: datastat?.upcoming?.amount
        ? formatCurrency(datastat.upcoming.amount)
        : "N/A",
      change: datastat?.upcoming?.amount_percentage ?? 0,
      percentage: datastat?.upcoming?.amount_percentage ?? 0,
      icon: <TbCurrencyNaira size={"18px"} className="text-gray-500" />,
    },
    {
      title: "Total Overdue Payment",
      amount: datastat?.overdue?.amount
        ? formatCurrency(datastat.overdue.amount)
        : "N/A",
      change: datastat?.overdue?.amount_percentage ?? 0,
      percentage: datastat?.overdue?.amount_percentage ?? 0,
      icon: <TbCurrencyNaira size={"18px"} className="text-gray-500" />,
    },
  ];
  // const chartData = datatrend?.total_repayment_by_month

  const chartData =
    linechartselectedYear === "This Year"
      ? Object.entries(datatrend?.total_repayment_by_year || {}).map(
          ([month, value]) => ({
            month,
            value: parseFloat(value as string) || 0,
          })
        )
      : linechartselectedYear === "This Month"
      ? Object.entries(datatrend?.total_repayment_by_month || {}).map(
          ([day, value]) => ({
            month: day,
            value: parseFloat(value as string) || 0,
          })
        )
      : Object.entries(datatrend?.total_repayment_by_week || {}).map(
          ([day, value]) => ({
            month: day,
            value: parseFloat(value as string) || 0,
          })
        );
  // const chartData = monthlyChartData

  const barChartData = [
    { name: "Jan", revenue: 100000 },
    { name: "Feb", revenue: 120000 },
    { name: "Mar", revenue: 150000 },
    { name: "Apr", revenue: 180000 },
    { name: "May", revenue: 200000 },
    { name: "Jun", revenue: 220000 },
    { name: "Jul", revenue: 250000 },
    { name: "Aug", revenue: 280000 },
    { name: "Sep", revenue: 300000 },
    { name: "Oct", revenue: 320000 },
    { name: "Nov", revenue: 350000 },
    { name: "Dec", revenue: 400000 },
  ];

 // Assuming you have access to the loanRepaymentsStats state
const pieChartData = [
  { 
    name: "Active", 
    value: datastat?.repayment_rate.active_percentage|| 0, 
    color: "#156064" 
  },
  { 
    name: "Rejected", 
    value: datastat?.repayment_rate.rejected_percentage || 0, 
    color: "#FA4D56" 
  },
  { 
    name: "Overdue", 
    value: datastat?.repayment_rate.overdue_percentage || 0, 
    color: "#EC7910" 
  },
];

  const progressBarData = [
    {
      name: "Personal Loans",
      value: 65,
      target: 100,
      label: "Personal",
      maxValue: 100,
    },
    {
      name: "Business Loans",
      value: 45,
      target: 80,
      label: "Business",
      maxValue: 80,
    },
    {
      name: "Education Loans",
      value: 30,
      target: 50,
      label: "Education",
      maxValue: 50,
    },
    {
      name: "Emergency Loans",
      value: 80,
      target: 90,
      label: "Emergency",
      maxValue: 90,
    },
  ];

  const pending_loans = [
    {
      id: 1,
      name: "John Doe",
      amount: "₦150,000",
      date: "2023-05-15",
      status: "Pending",
      product: "Personal Loan",
      first_name: "John",
      last_name: "Doe",
      average_income: "₦500,000",
      amount_requested: "₦150,000",
      repayment_duration: "12 months",
      repayment_interval: "Monthly",
      purpose: "Home renovation",
      employment_status: "Employed",
    },
  ];

  const tableHeaders = ["Name", "Amount", "Date", "Status", "Product"];
  const tableTitleProps = {
    mainTitle: "Pending Loans",
    requestCount: pending_loans.length,
    subtitle: "List of all pending loan applications",
  };

  const handleSearchClick = () => {
    console.log("Search clicked");
  };

  const handleFilterClick = () => {
    console.log("Filter clicked");
  };

  const handleSeeAllClick = () => {
    console.log("See all clicked");
  };

  const handleFundWallet = () => {
    console.log("Fund wallet clicked");
  };

  const formattedTotalSumRevenue = "₦3,450,000";
  const getTotalDefaults = () => {
    if (!datatrend) return "₦0";

    if (linechartselectedYear === "This Year") {
      return formatCurrency(datatrend.total_sum_repayment_by_year);
    } else if (linechartselectedYear === "This Month") {
      return formatCurrency(datatrend.total_sum_repayment_by_month);
    } else {
      return formatCurrency(datatrend.total_sum_repayment_by_week);
    }
  };

  const formattedTotalSumDefaults = getTotalDefaults();
  const total_loans = "125";
  const total_count = pending_loans.length;

  const [barchartselectedYear, setbarchartSelectedYear] = React.useState(
    lineChartDefaultSelectedYear
  );
  const { selectedIds, setSelectedIds } = useDashboard();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsDeleteModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 
  
  
  const handleOpenModal = () => {
    if (selectedIds.length >= 1) {
      setIsDeleteModalOpen(true);
    } else {
      toast.error("Please select more than one item to perform this action.");
    }
  };

  return (
    <div>
      <p className="font-semibold text-4xl text-[#333333] mb-6 bg-[#FAFAFA]">
        Repayment
      </p>

      <YearDropdown
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <div className=" relative ">
        {isDeleteModalOpen && (
          <div
            ref={modalRef}
            className=" absolute z-50 right-5 top-[820px] hidden md:flex"
          >
            {" "}
            <DropdownMenu
              onClick={(e) => e.stopPropagation()}
              productId={selectedIds}
              setActiveDropdown={setIsDeleteModalOpen}
            />
          </div>
        )}
        <Repayment
          stats={stats}
          chartData={chartData}
          barChartData={barChartData}
          pieChartData={pieChartData}
          onSearchClick={handleSearchClick}
          onFilterClick={handleFilterClick}
          onSeeAllClick={handleSeeAllClick}
          onFundWallet={handleFundWallet}
          pieChartTitle="Loan Repayment Rate"
          pieChartDescription="Total loan repayment metrics"
          pieChartTotal={total_loans ?? "N/A"}
          lineChartTitle="Repayment Trend"
          lineChartDescription="Repayment Overtime"
          lineChartTotalRevenue={formattedTotalSumDefaults}
          lineChartRevenueChange="(30,00)"
          lineChartLineColor="#0F4C5C"
          lineChartDefaultSelectedYear={lineChartDefaultSelectedYear}
          selectedYear={linechartselectedYear}
          setSelectedYear={setlinechartSelectedYear}
          barselectedYear={barchartselectedYear}
          barsetSelectedYear={setbarchartSelectedYear}
          progressBarTitle="Sales Performance"
          progressBarDescription="Total sales performance of different products"
          href={"#"}
          total_count={data?.data.total}
          laon_table_data_all={data?.data.data || []}
          bulkAction={() => handleOpenModal()}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={data?.last_page}
        />
      </div>
    </div>
  );
}
