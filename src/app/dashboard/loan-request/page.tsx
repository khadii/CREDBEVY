"use client";

import React, { useState } from "react";
import DynamicHeader from "../../components/DynamicHeader";
import Layout from "@/app/components/Layout/Layout";
import { HeaderWithTabs } from "@/app/components/HeadersTab";
import Dashboard from "../reuseabledashboaard";
import { TbCurrencyNaira } from "react-icons/tb";
import { LuSquareActivity } from "react-icons/lu";
import Table from "@/app/components/Tableone/Datatable";
import LoanRequestActions from "@/app/components/Search";
import { Tabs } from "@/app/components/Tabs";
import { LoanRequestHeaderWithTabs } from "./ReuseableHeader";
import { LoanHistoryExample } from "@/app/components/ChartCards/LoanHistoryReuasbleTable";

export default function Page() {
  const tabs = [
    { name: "All Request" },
    { name: "Pending Request", count: 200 },
    { name: "Approved Requests" },
    { name: "Canceled Requests" },
  ];

  const years = ["This Year", "Last Year"];

  const handleYearChange = (year: string) => {
    console.log("Selected Year:", year);
  };

  const handleSearchClick = () => {
    console.log("Search button clicked");
  };

  const handleFilterClick = () => {
    console.log("Filter button clicked");
  };

  const handleSeeAllClick = () => {
    console.log("See All link clicked");
  };

  const handleFundWallet = () => {
    alert("Redirecting to funding page...");
  };

  const stats = [
    {
      title: "Total Revenue generated",
      amount: "₦ 20,000,000.00",
      percentage: "15.00%",
      icon: <TbCurrencyNaira size={"18px"} className="text-gray-500" />,
    },
    {
      title: "Total Loan Disbursed",
      amount: "₦ 20,000,000.00",
      percentage: "15.00%",
      icon: <TbCurrencyNaira size={"18px"} className="text-gray-500" />,
    },
    {
      title: "Total Loan Volume",
      amount: "3,000,000,000",
      percentage: "15.00%",
      icon: <LuSquareActivity size={"18px"} className="text-gray-500" />,
    },
  ];

  const chartData = [
    { month: "January", value: 16 },
    { month: "February", value: 12 },
    { month: "March", value: 10 },
    { month: "April", value: 8 },
    { month: "May", value: 6 },
    { month: "June", value: 4 },
    { month: "July", value: 2 },
    { month: "August", value: 16 },
    { month: "September", value: 12 },
    { month: "October", value: 10 },
    { month: "November", value: 8 },
    { month: "December", value: 6 },
  ];

  const barChartData = [
    { name: "Jan", revenue: 10 },
    { name: "Feb", revenue: 15 },
    { name: "Mar", revenue: 20 },
    { name: "Apr", revenue: 25 },
    { name: "May", revenue: 30 },
    { name: "Jun", revenue: 35 },
    { name: "Jul", revenue: 40 },
    { name: "Aug", revenue: 45 },
    { name: "Sep", revenue: 50 },
    { name: "Oct", revenue: 55 },
    { name: "Nov", revenue: 60 },
    { name: "Dec", revenue: 65 },
  ];

  const pieChartData = [
    { name: "Approved", value: 200, color: "#156064" },
    { name: "Unapproved", value: 300, color: "#EC7910" },
  ];

  const progressBarData = [
    { label: "Product A", value: 50000, maxValue: 100000 },
    { label: "Product B", value: 75000, maxValue: 100000 },
    { label: "Product C", value: 90000, maxValue: 100000 },
    { label: "Product D", value: 30000, maxValue: 100000 },
  ];

  const formatCurrency = (value: any) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);

  const requests = [
    {
      name: "Oripeolye Timilehin",
      income: `${formatCurrency(134000000.0)}`,
      amount: `${formatCurrency(134000000.0)}`,
      cs: 743,
      ir: `${23}%`,
      duration: `${3} Months`,
      status: "Interested",
    },
    {
      name: "Oripeolye Timilehin",
      income: `${formatCurrency(134000000.0)}`,
      amount: `${formatCurrency(134000000.0)}`,
      cs: 743,
      ir: `${23}%`,
      duration: `${6} Months`,
      status: "Not Interested",
    },
    {
      name: "Oripeolye Timilehin",
      income: `${formatCurrency(134000000.0)}`,
      amount: `${formatCurrency(134000000.0)}`,
      cs: 743,
      ir: `${23}%`,
      duration: `${6} Months`,
      status: "Interested",
    },
    {
      name: "Oripeolye Timilehin",
      income: `${formatCurrency(134000000.0)}`,
      amount: `${formatCurrency(134000000.0)}`,
      cs: 743,
      ir: `${23}%`,
      duration: `${6} Months`,
    },
    {
      name: "Oripeolye Timilehin",
      income: `${formatCurrency(134000000.0)}`,
      amount: `${formatCurrency(134000000.0)}`,
      cs: 743,
      ir: `${23}%`,
      duration: `${6} Months`,
    },
  ];

  const headers = [
    "Name",
    "Average Income",
    "Amount Requested",
    "C.S",
    "I.R",
    "Duration",
    "Quick Actions",
  ];

  const tableHeaders = [
    "Name",
    "Average Income",
    "Amount Requested",
    "C.S",
    "I.R",
    "Duration",
    "Quick Actions",
  ];

  const tableTitleProps = {
    mainTitle: "Pending Loan request",
    requestCount: "200 requests",
    subtitle: "Loans awaiting a decision",
  };

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "All Request":
        return (
          <>
            <HeaderWithTabs
              title="Loan Request"
              tabs={tabs}
              years={years}
              onTabChange={handleTabChange}
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
              barChartTitle="Loan Disbursement"
              barChartDescription="Total loan amount disbursed over time."
              barChartTotalAmount="₦ 50,000,000.00"
              barChartHighlightBar="Dec"
              barChartHighlightColor="#EC7910"
              pieChartTitle="Loan Approval Rate"
              pieChartDescription="The percentage of loan requests approved."
              pieChartTotal="80,000"
              lineChartTitle="Default Rate"
              lineChartDescription="Total unpaid loan value."
              lineChartTotalRevenue="₦ 20,000,000.00"
              lineChartRevenueChange="(30,00)"
              lineChartLineColor="#0F4C5C"
              lineChartDefaultSelectedYear="This Year"
              progressBarTitle="Sales Performance"
              progressBarDescription="Total sales performance of different products"
              href={"/dashboard/loan-request/details"}
            />
          </>
        );
      case "Pending Request":
        return (
          <div className="">
            <LoanRequestHeaderWithTabs title="Loan Request" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} ></LoanRequestHeaderWithTabs>
            <LoanRequestActions
              onSearchClick={handleSearchClick}
              onFilterClick={handleFilterClick}
              onSeeAllClick={handleSeeAllClick}
            />
            <Table
              headers={tableHeaders}
              data={requests}
              titleProps={tableTitleProps}
              href={"#"}
            />
          </div>
        );
      case "Approved Requests":
        return <div>            <LoanRequestHeaderWithTabs title="Loan Request" tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} ></LoanRequestHeaderWithTabs>      <LoanRequestActions
        onSearchClick={handleSearchClick}
        onFilterClick={handleFilterClick}
        onSeeAllClick={handleSeeAllClick}
      /><LoanHistoryExample/></div>;
      case "Canceled Requests":
        return <div>Canceled Requests Content</div>;
      default:
        return (
          <>
            <HeaderWithTabs
              title="Loan Request"
              tabs={tabs}
              years={years}
              onTabChange={handleTabChange}
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
              barChartTitle="Loan Disbursement"
              barChartDescription="Total loan amount disbursed over time."
              barChartTotalAmount="₦ 50,000,000.00"
              barChartHighlightBar="Dec"
              barChartHighlightColor="#EC7910"
              pieChartTitle="Loan Approval Rate"
              pieChartDescription="The percentage of loan requests approved."
              pieChartTotal="80,000"
              lineChartTitle="Default Rate"
              lineChartDescription="Total unpaid loan value."
              lineChartTotalRevenue="₦ 20,000,000.00"
              lineChartRevenueChange="(30,00)"
              lineChartLineColor="#0F4C5C"
              lineChartDefaultSelectedYear="This Year"
              progressBarTitle="Sales Performance"
              progressBarDescription="Total sales performance of different products"
              href={"/dashboard/loan-request/details"}
            />
          </>
        );
    }
  };

  return <Layout>{renderContent()}</Layout>;
}
