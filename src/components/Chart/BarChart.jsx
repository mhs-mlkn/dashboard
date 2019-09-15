import React, { useState, useEffect } from "react";
import { Subscribe } from "unstated";
import {
  BarChart,
  Bar,
  Brush,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Legend
} from "recharts";
import ThemeContainer from "../../containers/Theme.container";
import { getDataMin } from "../../util";
import COLORS from "../../constants/colors";
import { formatNumber, getValue, renderColorfulLegendText } from "../../util";

import { BAR_CHART_CONFIG as CONFIG } from "../../constants";

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const [opacity, setOpacity] = useState({});
  const { data, width, height, onClick } = props;
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

  const onClickHandler = data => {
    onClick && onClick(data);
  };

  const getDomain = scale => {
    const minValue = min === 0 ? min + 0.1 : min;
    return ["log"].indexOf(scale) > -1 ? [minValue, "dataMax"] : undefined;
  };

  const xTick = theme => getValue(config.xAxis.tick, theme);
  const yTick = theme => getValue(config.yAxis.tick, theme);

  return (
    <Subscribe to={[ThemeContainer]}>
      {Theme => (
        <BarChart
          data={data}
          width={width}
          height={height}
          margin={{ top: 5, right: 10 }}
          layout={config.layout}
        >
          {keys.map((key, i) => (
            <Bar
              type="monotone"
              dataKey={key}
              key={key}
              stroke={COLORS[i % 19]["500"]}
              fill={COLORS[i % 19]["500"]}
              opacity={opacity[key]}
              onClick={onClickHandler}
              stackId={config.stacked ? "" : i}
            />
          ))}
          {config.brush && <Brush dataKey="name" height={20} />}
          <CartesianGrid
            stroke="transparent"
            strokeDasharray="3 3"
            vertical={false}
            horizontalFill={
              Theme.state.type === "light"
                ? ["#ccc", "#fff"]
                : ["#555555", "#444444"]
            }
            fillOpacity={0.2}
          />
          {config.layout === "vertical" ? (
            <XAxis
              type="number"
              unit={config.xAxis.unit}
              height={+config.xAxis.height}
              angle={+config.xAxis.angle}
              tick={xTick(Theme.state.type)}
              scale={config.xAxis.scale}
              domain={getDomain(config.xAxis.scale)}
              allowDataOverflow
              tickFormatter={d =>
                formatNumber(d / Math.pow(10, +config.xAxis.divideBy))
              }
            >
              <Label
                angle={0}
                position="insideBottomRight"
                style={{ textAnchor: "start" }}
              >
                {config.xAxis.label}
              </Label>
            </XAxis>
          ) : (
            <XAxis
              dataKey="name"
              height={+config.xAxis.height}
              angle={+config.xAxis.angle}
              tick={xTick(Theme.state.type)}
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
          )}
          {config.layout === "vertical" ? (
            <YAxis
              dataKey="name"
              type="category"
              width={+config.yAxis.width}
              angle={+config.yAxis.angle}
              tick={yTick(Theme.state.type)}
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
              tick={yTick(Theme.state.type)}
              scale={config.yAxis.scale}
              domain={getDomain(config.yAxis.scale)}
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
          )}
          <Tooltip
            wrapperStyle={{ left: "0" }}
            cursor={{ fill: "#FFF1" }}
            formatter={(value, name) => [formatNumber(value), name]}
          />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...config.legend}
            formatter={renderColorfulLegendText}
          />
        </BarChart>
      )}
    </Subscribe>
  );
};

export default Chart;
