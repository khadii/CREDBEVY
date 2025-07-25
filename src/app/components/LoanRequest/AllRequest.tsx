// src/app/pages/loan-request/AllRequest.tsx
import React from "react";
import { HeaderWithTabs } from "@/app/components/HeadersTab";
import Dashboard from "../../components/LoanRequest/reuseabledashboaard";

interface AllRequestProps {
  tabs: any;
  years: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: any;
  chartData:  any;
  barChartData:any;
  pieChartData: any;
  progressBarData: any;
  requests: any;
  tableHeaders:any;
  tableTitleProps: any;
  handleSearchClick: () => void;
  handleFilterClick: () => void;
  handleSeeAllClick: () => void;
  handleFundWallet: () => void;
  handleYearChange: (year: string) => void;
  setSelectedYear:any,
  selectedYear:any
  total_count:any
bulkAction:any
barChartTotalAmount:any
pieChartTotal:any
}

export default function AllRequest({
  tabs,
  years,
  activeTab,
  setActiveTab,
  stats,
  chartData,
  barChartData,
  pieChartData,
  progressBarData,
  requests,
  tableHeaders,
  tableTitleProps,
  handleSearchClick,
  handleFilterClick,
  handleSeeAllClick,
  handleFundWallet,
  handleYearChange,
  setSelectedYear,
  selectedYear,
  total_count,
bulkAction,
barChartTotalAmount,
pieChartTotal
}: AllRequestProps) {
  return (
    <div className="">
      <HeaderWithTabs
        title="Loan Request"
        tabs={tabs}
        years={years}
        onTabChange={setActiveTab}
        onYearChange={handleYearChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Dashboard
        stats={stats}
        chartData={chartData}
        barChartData={barChartData}
        pieChartData={pieChartData}
        progressBarData={progressBarData}
        tableData={requests}
        tableHeaders={tableHeaders}
        tableTitleProps={tableTitleProps}
        onSearchClick={handleSearchClick}
        onFilterClick={handleFilterClick}
        onSeeAllClick={handleSeeAllClick}
        onFundWallet={handleFundWallet}
        barChartTitle="Loan Request Trend"
        barChartDescription="Total Amount requested."
        barChartTotalAmount={barChartTotalAmount}
        barChartHighlightBar="Dec"
        barChartHighlightColor="#EC7910"
        pieChartTitle="Loan Approval Rate"
        pieChartDescription="The percentage of loan requests approved."
        pieChartTotal={pieChartTotal}
        lineChartTitle="Default Rate"
        lineChartDescription="Total unpaid loan value."
        lineChartTotalRevenue="₦ 20,000,000.00"
        lineChartRevenueChange="(30,00)"
        lineChartLineColor="#0F4C5C"
        lineChartDefaultSelectedYear="This Year"
        progressBarTitle="Sales Performance"
        progressBarDescription="Total sales performance of different products"
        href={"/dashboard/loan-request/details"} selectedYear={selectedYear} setSelectedYear={setSelectedYear} total_count={total_count} bulkAction={bulkAction}      />
    </div>
  );
}