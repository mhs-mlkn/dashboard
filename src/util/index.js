export const getDataMin = (data = [], keys = []) => {
  let min = Number.MAX_SAFE_INTEGER;
  for (const item of data) {
    for (const key of keys) {
      const val = item[key];
      min = val < min ? val : min;
    }
  }
  return min;
};

export function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
