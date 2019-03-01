export const data = [
  { name: "کاپ کیک", cal: 305, fat: 3.7 },
  { name: "دونات", cal: 452, fat: 25.0 },
  { name: "تیتاپ", cal: 262, fat: 16.0 },
  { name: "کیک قاشقی", cal: 159, fat: 6.0 },
  { name: "پیراشکی", cal: 356, fat: 16.0 },
  { name: "کیک خانگی", cal: 408, fat: 3.2 },
  { name: "ژله", cal: 237, fat: 9.0 },
  { name: "پنیر پیتزا", cal: 375, fat: 0.0 },
  { name: "پفک", cal: 518, fat: 26.0 },
  { name: "تخم مرغ", cal: 392, fat: 0.2 },
  { name: "خامه", cal: 318, fat: 250 },
  { name: "چیپس سیب زمینی", cal: 360, fat: 19.0 },
  { name: "سمبوسه", cal: 437, fat: 18.0 },
  { name: "سوسیس", cal: 400, fat: 100 },
  { name: "شیر", cal: 100, fat: 12.0 }
];

export const columns = [
  { path: "name", title: "نام" },
  { path: "cal", title: "گالری" },
  { path: "fat", title: "چربی" }
];

const mockdata = (page, rowsPerPage) => {
  return Promise.resolve(
    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  );
};

export default mockdata;
