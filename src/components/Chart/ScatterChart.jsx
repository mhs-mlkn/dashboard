import React, { useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  Cell,
  Brush,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Label
} from "recharts";
import COLORS from "../../constants/colors";
import { getDataRange } from "../../util";
import { Scatter_CHART_CONFIG as CONFIG } from "../../constants";
import { formatNumber } from "../../util";

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const { data, width, height } = props;
  let config = { ...CONFIG, ...props.config };
  const keys = getDataKeys(data[0] || {});

  useEffect(() => {
    config = { ...CONFIG, ...props.config };
  }, [props.config]);

  return (
    <ScatterChart
      data={data}
      width={width}
      height={height}
      margin={{ top: 5, right: 10 }}
    >
      {config.brush && <Brush dataKey="name" height={20} />}
      <XAxis
        dataKey="name"
        height={+config.xAxis.height || 30}
        angle={+config.xAxis.angle}
        tick={{
          ...config.xAxis.tick,
          fontSize: `${config.xAxis.tick.fontSize}px`
        }}
        allowDataOverflow
      >
        <Label
          angle={0}
          position="insideBottomRight"
          style={{ textAnchor: "start" }}
        >
          {config.xAxis.label}
        </Label>
      </XAxis>

      <YAxis
        dataKey={keys[0]}
        unit={config.yAxis.unit}
        width={+config.yAxis.width}
        angle={+config.yAxis.angle}
        tick={{ ...config.yAxis.tick }}
        allowDataOverflow
        label={{
          value: config.yAxis.label,
          angle: -90,
          position: "insideLeft"
        }}
        tickFormatter={d =>
          formatNumber(d / Math.pow(10, +config.yAxis.divideBy))
        }
      />

      {keys.length > 1 && (
        <ZAxis dataKey={keys[1]} range={getDataRange(data, keys[1])} />
      )}
      <CartesianGrid
        stroke="transparent"
        strokeDasharray="3 3"
        vertical={false}
        horizontalFill={["#555555", "#444444"]}
        fillOpacity={0.2}
      />
      <Tooltip
        wrapperStyle={{ left: "0" }}
        formatter={(value, name) => [formatNumber(value), name]}
      />
      <Scatter data={data} name={props.name}>
        {/* {data.map((entry, index) => {
          return (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          );
        })} */}
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % 19]["500"]} />
        ))}
      </Scatter>
    </ScatterChart>
  );
};

export default Chart;
