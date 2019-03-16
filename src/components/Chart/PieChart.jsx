import React, { PureComponent } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import purple from "@material-ui/core/colors/purple";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import grey from "@material-ui/core/colors/grey";
import brown from "@material-ui/core/colors/brown";

const COLORS = [purple, orange, red, yellow, blue, green, amber, grey, brown];

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Chart extends PureComponent {
  render() {
    const { data, width, height } = this.props;
    const keys = getDataKeys(data[0] || {});
    return (
      <PieChart width={width} height={height}>
        {keys.length > 0 && (
          <Pie
            data={data}
            dataKey={keys[0]}
            label={renderCustomizedLabel}
            labelLine={false}
            paddingAngle={3}
            fill={green["500"]}
            // innerRadius={70}
            // outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % 9]["500"]} />
            ))}
          </Pie>
        )}
        <Tooltip wrapperStyle={{ left: "0" }} />
        <Legend />
      </PieChart>
    );
  }
}

export default Chart;
