import React from "react";
import { ResponsiveContainer } from "recharts";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import RadarChart from "./RadarChart";

const Chart = props => {
  const { type, aspect = 0, ...rest } = props;

  const getChart = type => {
    switch (type) {
      case "Line":
        return <LineChart {...rest} />;

      case "Area":
        return <AreaChart {...rest} />;

      case "Bar":
        return <BarChart {...rest} />;

      case "Pie":
        return <PieChart {...rest} />;

      case "Radar":
        return <RadarChart {...rest} />;

      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer aspect={aspect}>{getChart(type)}</ResponsiveContainer>
  );
};

export default Chart;
