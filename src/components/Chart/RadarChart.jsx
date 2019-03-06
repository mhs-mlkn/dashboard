import React, { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  Legend
} from "recharts";
import purple from "@material-ui/core/colors/purple";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import grey from "@material-ui/core/colors/grey";
import brown from "@material-ui/core/colors/brown";

const colors = [purple, orange, red, yellow, blue, green, amber, grey, brown];

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const [opacity, setOpacity] = useState({});
  const { data, width, height } = props;
  const keys = getDataKeys(data[0] || {});

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
    <RadarChart
      data={data}
      width={width}
      height={height}
      margin={{ top: 5, right: 10 }}
    >
      {keys.map((key, i) => (
        <Radar
          type="monotone"
          dataKey={key}
          key={key}
          stroke={colors[i]["500"]}
          fill={colors[i]["500"]}
          opacity={opacity[key]}
        />
      ))}
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      {/* <PolarRadiusAxis /> */}
      <Tooltip wrapperStyle={{ left: "0" }} />
      <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
    </RadarChart>
  );
};

export default Chart;
