export let lineData: Object[] = [
     { x: "Thứ hai", y: 250 },{ x: "Thứ ba", y: 206 }, { x: "Thứ tư", y: 270 },
    { x: "Thứ năm", y: 320 }, { x: "Thứ sáu", y: 350 },
    { x: "Thứ bảy", y: 28 },
];

export let data: Object[] = [
    { x: "Thứ hai", y: 378 }, { x: "Thứ ba", y: 416 },
    { x: "Thứ tư", y: 404 }, { x: "Thứ năm", y: 390 },
    { x: "Thứ sáu", y: 376 },
    { x: "Thứ bảy", y: 45 },

];
export let dataTwo: Object[] = [
    { x: "Thứ hai", y: 200 }, { x: "Thứ ba", y: 302 },
    { x: "Thứ tư", y: 329 }, { x: "Thứ năm", y: 210 },
    { x: "Thứ sáu", y: 100 },
    { x: "Thứ bảy", y: 70 },

];
export let targetData: Object[] =
[
    { x: 'T1', y: 40, text: '40%' },
    { x: 'T2', y: 30, text: '30%' },
    { x: 'T3', y: 16, text: '16%' },
    { x: 'T5', y: 14, text: '14%' }
  ];

  export let collectData: Object[] =
  [
    { x: 'T1', y: 38, color: "#045E2B" },
    { x: 'T2', y: 42, color: "#F58501"},
    { x: 'T3', y: 56, color: "#16C8C7" },
    { x: 'T5', y: 64,  color: "#1D85E7" }
  ];


  export let warfaceData: Object[] =
    [
      { x: 'T5', y: 19,  color: "#1D85E7" },
      { x: 'T3', y: 12, color: "#16C8C7" },
      { x: 'T2', y: 8, color: "#F58501"},
      { x: 'T1', y: 9, color: "#045E2B" },

    ];
  export let nuanceData: Object[] =
    [
      { x: 'Tích cực', y: 10 },
      { x: 'Trung lập', y: 20 },
      { x: 'Tiêu cực', y: 1 },
    ];
export let postData: Object[] =
  [
    { x: 'Báo chính thống',y: 12, color: "#045E2B" },
    { x: 'Facebook', y: 8, color: "#F58501"},
    { x: 'TikTok', y: 18, color: "#16C8C7"},
    { x: 'Youtube', y: 8, color: "#1D85E7" }
  ];

  export let relatedTargetData: Object[] =
[
    { x: 'Facebook', y: 40, text: '22%' },
    { x: 'TikTok', y: 30, text: '22%' },
    { x: 'Zalo', y: 16, text: '22%' },
    { x: 'Twitter', y: 14, text: '22%' },
    { x: 'Báo chính thống', y: 14, text: '22%' },
    { x: 'Youtube', y: 14, text: '22%' },
  ];

// pie chart varible
export let KGMPieData: Object[] = [
  { x: 'Tích cực', y: 40 },
  { x: 'Trung lập', y: 40 },
  { x: 'Tiêu cực', y: 20 },

];
export let BTLPieData: Object[] = [
  { x: 'Tích cực', y: 40 },
  { x: 'Trung lập', y: 40 },
  { x: 'Tiêu cực', y: 20 },
];

export let hotTopicData: Object[] =
  [
    { x: 'Nga-UKraine', y: 2 },
    { x: 'Biển đông', y: 1 },
    { x: 'Quân đội', y: 4 },
    { x: 'Khiếu kiện đất đai', y: 2 },
    { x: 'Uỷ viên BCT', y: 12 },
    { x: 'Đảng, Nhà nước', y: 19 },
  ];

export let uploadPostData: Object[] =
  [
    { x: 'V4', y: 8,  color: "#1D85E7" },
    { x: 'T3', y: 18, color: "#16C8C7" },
    { x: 'T2', y: 8, color: "#F58501"},
    { x: 'T1', y: 12, color: "#045E2B" }
  ];


// data lực lượng UCSC
export let forceData: Object[] = [
  { x: 'T1', y: 8, y1: 7, y2: 10 },
  { x: 'T2', y: 10, y1: 8, y2: 2 },
  { x: 'T3', y: 7, y1: 3, y2: 5 },
  { x: 'T5', y: 10, y1: 8, y2: 7 },
];

// [
//   {
//       "501": 8,
//       "502": 10,
//       "x": "T5"
//   },
//   {
//       "101": 7,
//       "102": 6,
//       "103": 6,
//       "x": "T1"
//   },
//   {
//       "201": 8,
//       "202": 7,
//       "203": 9,
//       "x": "T2"
//   },
//   {
//       "301": 9,
//       "302": 6,
//       "303": 7,
//       "x": "T3"
//   }
// ]


export const muctieubaoveDetail =  [
  { target: 'BT BTP123 ', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T1' },
  { target: '2/ Nguyễn Văn A', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T2' },
  { target: 'CNTCCT', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T1' },
  { target: '2/ Nguyễn Văn A', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T3' },
  { target: 'TTMT', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T1' },
  { target: '2/ Nguyễn Văn F', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T2' },
  { target: 'UVBCT', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T1' },
  { target: '4/ Nguyễn Văn E', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T3' },
  { target: 'UVBCT1', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T2' },
  { target: '1// Nguyễn Văn D', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T1' },
  { target: 'UVBCT2', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T3' },
  { target: '1/ Nguyễn Văn C', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T2' },
  { target: 'UVBCT3', priority: 'Chủ yếu', type: 'Lãnh đạo', unit: 'T1' },
  { target: '1/ Nguyễn Văn B', priority: 'Thứ yếu', type: 'Cấp cao', unit: 'T2' }

];
