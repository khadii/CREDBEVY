"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type LineChartComponentProps = {
  data: { month: string; value: number }[];
  lineColor?: string;
  showGrid?: boolean;
};

const LineChartComponent = ({
  data,
  lineColor = "#0F4C5C",
  showGrid = true,
}: LineChartComponentProps) => {
  return (
    <ResponsiveContainer width="100%" height={257}>
      <RechartsLineChart
        data={data}
        // margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
      >
        {showGrid && <CartesianGrid vertical={false} stroke="#E5E7EB" />}
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)} // Shorten month names to 3 letters
          tick={{ fill: "#333333", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`} // Format Y-axis labels as percentages
          width={30}
          tick={{ fill: "#333333", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dataKey="value"
          type="linear"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3">
        <p className="text-sm text-[#333333]">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default LineChartComponent;