export const AXIS_SCALES = ["auto", "linear", "pow", "sqrt", "log"];

export const PIE_LABEL_RENDER_TYPE = {
  SIMPLE: 0,
  LINE: 1
};

export const LEGEND_CONFIG = {
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom",
  iconType: "rect"
};

export const AXIS_CONFIG = {
  width: 60,
  height: 30,
  unit: "",
  label: "",
  divideBy: 0,
  angle: 0,
  scale: "auto",
  tick: {
    fill: "#e5e5e5",
    fontSize: "13",
    textAnchor: "start",
    fontFamily: "IRANSans"
  }
};

export const BAR_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG,
  yAxis: AXIS_CONFIG,
  xAxis: AXIS_CONFIG
};

export const AREA_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG,
  yAxis: AXIS_CONFIG,
  xAxis: AXIS_CONFIG
};

export const Line_CHART_CONFIG = {
  layout: "horizontal",
  stacked: false,
  brush: false,
  legend: LEGEND_CONFIG,
  yAxis: AXIS_CONFIG,
  xAxis: AXIS_CONFIG
};

export const Scatter_CHART_CONFIG = {
  brush: false,
  yAxis: AXIS_CONFIG,
  xAxis: AXIS_CONFIG
};

export const PIE_CHART_CONFIG = {
  innerRadius: 0,
  outerRadius: 80,
  legend: LEGEND_CONFIG,
  labelRenderType: PIE_LABEL_RENDER_TYPE.SIMPLE,
  labelValue: {
    label: true,
    value: true,
    percent: true
  }
};

export const RADAR_CHART_CONFIG = {
  innerRadius: 0,
  outerRadius: 80,
  legend: LEGEND_CONFIG
};

export const SCALAR_CONFIG = {
  mainBackground: "#424951",
  infoBackground: "#3a4047",
  textColor: "#fff"
};

export const CHART_CONFIG = {
  Bar: BAR_CHART_CONFIG,
  Area: AREA_CHART_CONFIG,
  Line: Line_CHART_CONFIG,
  Pie: PIE_CHART_CONFIG,
  Radar: RADAR_CHART_CONFIG,
  Scalar: SCALAR_CONFIG
};

export const CHANGE_DASHBOARD_INTERVAL = 60;
