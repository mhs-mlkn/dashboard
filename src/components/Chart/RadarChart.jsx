import React, { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  Legend
} from "recharts";
import COLORS from "../../constants/colors";
import ThemeContainer from "../../containers/Theme.container";
import { Subscribe } from "unstated";
import { renderColorfulLegendText } from "../../util";

import { RADAR_CHART_CONFIG as CONFIG } from "../../constants";

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
    <Subscribe to={[ThemeContainer]}>
      {Theme => (
        <RadarChart
          data={data}
          width={width}
          height={height}
          margin={{ top: 5, right: 10 }}
          innerRadius={`${config.innerRadius}%`}
          outerRadius={`${config.outerRadius}%`}
        >
          {keys.map((key, i) => (
            <Radar
              type="monotone"
              dataKey={key}
              key={key}
              stroke={COLORS[i % 19]["500"]}
              fill={COLORS[i % 19]["500"]}
              opacity={opacity[key]}
              dot={false}
            />
          ))}
          <PolarGrid />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: Theme.state.type === "dark" ? "#e5e5e5" : "#1e1e1e" }}
          />
          {/* <PolarRadiusAxis /> */}
          <Tooltip wrapperStyle={{ left: "0" }} />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...config.legend}
            formatter={renderColorfulLegendText}
          />
        </RadarChart>
      )}
    </Subscribe>
  );
};

export default Chart;
