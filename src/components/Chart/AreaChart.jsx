import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  Brush,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import COLORS from "../../constants/colors";

import { AREA_CHART_CONFIG as CONFIG } from "../../constants";

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const [opacity, setOpacity] = useState({});
  const { data, width, height } = props;
  let { config = CONFIG } = props;
  const keys = getDataKeys(data[0] || {});

  useEffect(() => {
    config = { ...CONFIG, ...config };
  }, [props.config]);

  const handleMouseEnter = o => {
    const { dataKey } = o;
    setOpacity({
      ...opacity,
      [dataKey]: 0.5
    });
  };

  const handleMouseLeave = o => {
    const { dataKey } = o;
    setOpacity({
      ...opacity,
      [dataKey]: 1
    });
  };

  return (
    <AreaChart
      data={data}
      width={width}
      height={height}
      margin={{ top: 5, right: 10 }}
      layout={config.layout}
    >
      {keys.map((key, i) => (
        <Area
          type="monotone"
          dataKey={key}
          key={key}
          stroke={COLORS[i % 19]["500"]}
          fill={COLORS[i % 19]["500"]}
          opacity={opacity[key]}
          stackId={config.stacked ? "" : i}
        />
      ))}
      {config.brush && <Brush dataKey="name" height={20} />}
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      {config.layout === "vertical" ? (
        <XAxis type="number" />
      ) : (
        <XAxis dataKey="name" />
      )}
      {config.layout === "vertical" ? (
        <YAxis dataKey="name" type="category" />
      ) : (
        <YAxis />
      )}
      <Tooltip wrapperStyle={{ left: "0" }} />
      <Legend
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...config.legend}
      />
    </AreaChart>
  );
};

export default Chart;
