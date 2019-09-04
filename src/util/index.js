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

export const getDataRange = (data = [], key) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  for (const item of data) {
    const val = item[key];
    min = val < min ? val : min;
    max = val > max ? val : max;
  }
  return [min, max];
};

export function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
