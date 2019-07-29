import React, { useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import COLORS from "../../constants/colors";
import { get } from "lodash";

import {
  PIE_CHART_CONFIG as CONFIG,
  PIE_LABEL_RENDER_TYPE
} from "../../constants";

const getDataKeys = data => Object.keys(data).filter(key => key !== "name");

const Chart = props => {
  const { data, width, height } = props;
  let { config = CONFIG } = props;
  const keys = getDataKeys(data[0] || {});

  useEffect(() => {
    config = { ...CONFIG, ...config };
  }, [props.config]);

  const onClickHandler = data => () => {
    props.onClick && props.onClick(data);
  };

  const renderCustomizedLabelSimple = props => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
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

  const renderCustomizedLabelLine = props => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + outerRadius * cos;
    const sy = cy + outerRadius * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 30;
    const ey = my;
    const textAnchor = cos < 0 ? "start" : "end";

    return (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 9}
          y={ey + 5}
          textAnchor={textAnchor}
          fill="#eee"
          style={{ direction: "rtl" }}
        >
          {/* `${payload.name}: ${value} (${(percent * 100).toFixed(2)}%)` */}
          {get(config, "labelValue.label", false) ? `${payload.name}: ` : ""}
          {get(config, "labelValue.value", false) ? `${value}` : ""}
          {get(config, "labelValue.percent", false)
            ? ` (${(percent * 100).toFixed(2)}%)`
            : ""}
        </text>
      </g>
    );
  };

  return (
    <PieChart width={width} height={height}>
      {keys.length > 0 && (
        <Pie
          data={data}
          dataKey={keys[0]}
          label={
            config.labelRenderType === PIE_LABEL_RENDER_TYPE.SIMPLE
              ? renderCustomizedLabelSimple
              : renderCustomizedLabelLine
          }
          labelLine={false}
          paddingAngle={0}
          innerRadius={config.innerRadius}
          outerRadius={`${config.outerRadius}%`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % 19]["500"]}
              onClick={onClickHandler(entry)}
            />
          ))}
        </Pie>
      )}
      <Tooltip
        wrapperStyle={{ left: "0", textAlign: "start", direction: "ltr" }}
      />
      <Legend {...config.legend} />
    </PieChart>
  );
};

export default Chart;
