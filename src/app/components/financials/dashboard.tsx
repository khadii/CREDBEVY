"use client";

import React, { useState } from "react";
import { YearDropdown } from "../Yeardropdown";
import { CircleAlert } from "lucide-react";
import { Tabs } from "../Tabs";
import Card from "../Card";
import Summary from "./summary";
import Trends from "./Trends";
import TransactionHistory from "./TransactionHistory";

export default function Dashboard() {
  const tabs = [
    { name: "Summary" },
    { name: "Trends and History" },
    // { name: "Financial Statement" },
    { name: "Transactions History" },
    // { name: "Goals and Targets" },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].name);
  const [selectedYear, setSelectedYear] = useState("This Year");

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return <Summary />;
      case "Trends and History":
        return <Trends />;
      case "Financial Statement":
        return <></>;
      case "Transactions History":
        return <TransactionHistory />;
      case "Goals and Targets":
        return <></>;
      default:
        return <Summary />;
    }
  };

  return (
    <div>
      <p className="font-semibold md:text-4xl text-2xl text-[#333333] mb-6 bg-[#FAFAFA]">
        Financials
      </p>
      <div className="mb-[26px]">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {renderTabContent()}
    </div>
  );
}
