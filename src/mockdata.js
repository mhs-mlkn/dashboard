export const Reports = {
  data: [
    {
      chartType: "Simple",
      created: "2019-02-26T16:14:18Z[UTC]",
      drillDownId: -1,
      id: 5,
      name: "مجموع کاربران",
      query: {
        dataSource: "oracleTehran",
        query:
          "select count(C_NAME) as کاربران,  1 as fake from T_DRIVEFOLDER where C_NAME = '__root__'",
        queryFilters: [],
        queryParams: []
      },
      source: "SQL",
      type: "Table",
      updated: "2019-02-26T16:14:18Z[UTC]",
      description: "توضیحات گزارش درباره تعداد فروش سالیانه"
    },
    {
      chartType: "Pie",
      created: "2019-02-26T16:15:06Z[UTC]",
      drillDownId: -1,
      id: 6,
      name: "نوع فایلهای آپلود شده",
      query: {
        dataSource: "oracleTehran",
        query:
          "select  C_TYPE as type, concat(round(sum(C_SIZE) /(1024*1024), 2), 'MB') as total from T_DRIVEFILE where C_WIPED != 1 group by C_TYPE order by sum(C_SIZE) desc",
        queryFilters: [],
        queryParams: []
      },
      source: "SQL",
      type: "Line",
      updated: "2019-02-26T16:15:06Z[UTC]"
    },
    {
      chartType: "Bar",
      created: "2019-02-26T16:15:19Z[UTC]",
      drillDownId: -1,
      id: 7,
      name: "فاکتورهای صادر شده",
      query: {
        dataSource: "oracleTehran",
        query:
          "select   concat(concat(regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1), '-'), regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 2)) as تاریخ,   sum(C_TOTALAMOUNTWITHTAX) as جمع,   count(1)  as تعداد from T_BILL bill where regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1) = :yrr GROUP BY regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1), regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 2) order by 1",
        queryFilters: [],
        queryParams: [
          {
            byUser: false,
            key: "yrr",
            type: "TEXT",
            value: "1397"
          }
        ]
      },
      source: "SQL",
      type: "Area",
      updated: "2019-02-26T16:15:19Z[UTC]"
    },
    {
      chartType: "Pie",
      created: "2019-02-26T16:15:31Z[UTC]",
      drillDownId: -1,
      id: 8,
      name: "نوع پرداختها",
      query: {
        dataSource: "oracleTehran",
        query:
          "select    nvl((select c_name  from T_CATEGORYELEMENT  where c_id = bi.F_PAYMENT_GATEWAY_TOOL), 'اعتبار') PAYMENT_GATEWAY_TOOL,   sum(bi.C_TOTALAMOUNTWITHTAX) amount,   sum(bi.C_DELEGATIONAMOUNT)  delegated_amount,   count(1)  count from t_invoice inv   inner join t_bill bi on bi.c_id = inv.f_bill where   inv.c_payed = 1   and inv.C_CANCELED = 0   and bi.c_payed = 1   and bi.C_CANCELED = 0 group by bi.F_PAYMENT_GATEWAY_TOOL",
        queryFilters: [],
        queryParams: []
      },
      source: "SQL",
      type: "Bar",
      updated: "2019-02-26T16:15:31Z[UTC]"
    },
    {
      chartType: "Pie",
      created: "2019-02-26T16:15:06Z[UTC]",
      drillDownId: -1,
      id: 55,
      name: "نوع فایلهای آپلود شده",
      query: {
        dataSource: "oracleTehran",
        query:
          "select  C_TYPE as type, concat(round(sum(C_SIZE) /(1024*1024), 2), 'MB') as total from T_DRIVEFILE where C_WIPED != 1 group by C_TYPE order by sum(C_SIZE) desc",
        queryFilters: [],
        queryParams: []
      },
      source: "SQL",
      type: "Pie",
      updated: "2019-02-26T16:15:06Z[UTC]"
    },
    {
      chartType: "Pie",
      created: "2019-02-26T16:15:31Z[UTC]",
      drillDownId: -1,
      id: 88,
      name: "نوع پرداختها",
      query: {
        dataSource: "oracleTehran",
        query:
          "select    nvl((select c_name  from T_CATEGORYELEMENT  where c_id = bi.F_PAYMENT_GATEWAY_TOOL), 'اعتبار') PAYMENT_GATEWAY_TOOL,   sum(bi.C_TOTALAMOUNTWITHTAX) amount,   sum(bi.C_DELEGATIONAMOUNT)  delegated_amount,   count(1)  count from t_invoice inv   inner join t_bill bi on bi.c_id = inv.f_bill where   inv.c_payed = 1   and inv.C_CANCELED = 0   and bi.c_payed = 1   and bi.C_CANCELED = 0 group by bi.F_PAYMENT_GATEWAY_TOOL",
        queryFilters: [],
        queryParams: []
      },
      source: "SQL",
      type: "Scalar",
      updated: "2019-02-26T16:15:31Z[UTC]"
    },
    {
      chartType: "Bar",
      created: "2019-02-26T16:15:19Z[UTC]",
      drillDownId: -1,
      id: 77,
      name: "فاکتورهای صادر شده",
      query: {
        dataSource: "oracleTehran",
        query:
          "select   concat(concat(regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1), '-'), regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 2)) as تاریخ,   sum(C_TOTALAMOUNTWITHTAX) as جمع,   count(1)  as تعداد from T_BILL bill where regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1) = :yrr GROUP BY regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 1), regexp_substr(C_ISSUANCEPERSIANDATE, '[^/]+', 1, 2) order by 1",
        queryFilters: [],
        queryParams: [
          {
            byUser: false,
            key: "yrr",
            type: "TEXT",
            value: "1397"
          }
        ]
      },
      source: "SQL",
      type: "Radar",
      updated: "2019-02-26T16:15:19Z[UTC]"
    }
  ],
  totalSize: 7
};

export const Table = {
  cols: [
    { type: "VARCHAR", key: "نام" },
    { type: "BIGINT", key: "کالری" },
    { type: "DECIMAL", key: "چربی" }
  ],
  rows: [
    { cols: ["کاپ کیک", 305, 3.7] },
    { cols: ["دونات", 452, 25.0] },
    { cols: ["تیتاپ", 262, 16.0] },
    { cols: ["کیک قاشقی", 159, 6.0] },
    { cols: ["پیراشکی", 356, 16.0] },
    { cols: ["کیک خانگی", 408, 3.2] },
    { cols: ["ژله", 237, 9.0] },
    { cols: ["پنیر پیتزا", 375, 0.0] },
    { cols: ["پفک", 518, 26.0] },
    { cols: ["تخم مرغ", 392, 0.2] },
    { cols: ["خامه", 318, 250] },
    { cols: ["چیپس سیب زمینی", 360, 19.0] },
    { cols: ["سمبوسه", 437, 18.0] },
    { cols: ["سوسیس", 400, 100] },
    { cols: ["شیر", 100, 12.0] }
  ]
};

export const Scalar = ["تعداد کاربران", 1849];

export const Charts = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 4800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

export const Dashboards = [
  {
    id: 1,
    config:
      '{"layout": [{"i": "8", "x": 0, "y": 0, "w": 12, "h": 24}], "settings": {}}'
  },
  {
    id: 2,
    config: '{"layout": []}'
  }
];
