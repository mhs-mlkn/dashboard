import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import RadarChart from "./RadarChart";
import ScatterChart from "./ScatterChart";

const Chart = props => {
  const [temp, setTemp] = useState(0);
  const { type, aspect = 0, height, ...rest } = props;

  useEffect(() => {
    setTimeout(() => setTemp(temp + 1), 10);
  }, []);

  const getChart = type => {
    switch (type) {
      case "Scatter":
        return <ScatterChart {...rest} />;

      case "Line":
        return <ScatterChart {...rest} />;

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
    <ResponsiveContainer aspect={aspect} height={height}>
      {getChart(type)}
    </ResponsiveContainer>
  );
};

export default Chart;
