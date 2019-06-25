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
import { getDataMin } from "../../util";
import COLORS from "../../constants/colors";

import { AREA_CHART_CONFIG as CONFIG } from "../../constants";

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const [opacity, setOpacity] = useState({});
  const { data, width, height } = props;
  let config = { ...CONFIG, ...props.config };
  const keys = getDataKeys(data[0] || {});
  const [min, setMin] = useState(Number.MIN_SAFE_INTEGER);

  useEffect(() => {
    setMin(getDataMin(data, keys));
  }, [props.data]);

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

  const getDomain = scale => {
    const minValue = min === 0 ? min + 0.1 : min;
    return ["log"].indexOf(scale) > -1 ? [minValue, "dataMax"] : undefined;
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
        <XAxis
          type="number"
          unit={config.xAxis.unit}
          height={+config.xAxis.height}
          angle={+config.xAxis.angle}
          tick={config.xAxis.tick}
          scale={config.xAxis.scale}
          domain={getDomain(config.xAxis.scale)}
          allowDataOverflow
          label={{
            value: config.xAxis.label,
            angle: 0,
            position: "insideBottomRight"
          }}
          tickFormatter={d => d / Math.pow(10, +config.xAxis.divideBy)}
        />
      ) : (
        <XAxis
          dataKey="name"
          height={+config.xAxis.height}
          angle={+config.xAxis.angle}
          tick={config.xAxis.tick}
          allowDataOverflow
          label={{
            value: config.xAxis.label,
            angle: 0,
            position: "insideBottomRight"
          }}
        />
      )}
      {config.layout === "vertical" ? (
        <YAxis
          dataKey="name"
          type="category"
          width={+config.yAxis.width}
          angle={+config.yAxis.angle}
          tick={config.yAxis.tick}
          allowDataOverflow
          label={{
            value: config.yAxis.label,
            angle: -90,
            position: "insideLeft"
          }}
        />
      ) : (
        <YAxis
          unit={config.yAxis.unit}
          width={+config.yAxis.width}
          angle={+config.yAxis.angle}
          tick={config.yAxis.tick}
          scale={config.yAxis.scale}
          domain={getDomain(config.yAxis.scale)}
          allowDataOverflow
          label={{
            value: config.yAxis.label,
            angle: -90,
            position: "insideLeft"
          }}
          tickFormatter={d => d / Math.pow(10, +config.yAxis.divideBy)}
        />
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
