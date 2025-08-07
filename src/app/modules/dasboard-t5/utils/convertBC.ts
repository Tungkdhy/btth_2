export function convertToStackChartDeepReportConfig(data: any,height = "360px") {
  // Map tên quốc gia
  const nameMap: Record<string, string> = {
    MAL: "MAI",
    TWN: "TAW"
  };

  // Thứ tự categories mong muốn
  const order = ["H", "MAI", "IND", "K", "BRN", "TAW", "Khác"];

  // Đổi tên & sắp xếp
  const converted = data.map((d: any) => ({
    target: nameMap[d.huong_tc] ?? d.huong_tc,
    capData: d.cap_data,
    totalReports: d.total_reports
  }))
    .sort((a: any, b: any) => order.indexOf(a.target) - order.indexOf(b.target));

  // Extract data cho từng cấp
  const capBoTuLenh = converted.map((d: any) => d.capData["Bộ Tư Lệnh"] ?? 0);
  const capCucTacChien = converted.map((d: any) => d.capData["Cục tác chiến"] ?? 0);
  const capTTBTTMBQP = converted.map((d: any) => d.capData["TT BTTM, BQP"] ?? 0);
  const capLDangNN = converted.map((d: any) => d.capData["LĐ Đảng, Nhà nước"] ?? 0);

  // Tính tổng tất cả báo cáo
  const totalReports = converted.reduce((sum: any, d: any) => sum + d.totalReports, 0);

  // Tính tổng từng cấp
  const sumBoTuLenh = capBoTuLenh.reduce((a:any, b:any) => a + b, 0);
  const sumCucTacChien = capCucTacChien.reduce((a:any, b:any) => a + b, 0);
  const sumTTBTTMBQP = capTTBTTMBQP.reduce((a:any, b:any) => a + b, 0);
  const sumLDangNN = capLDangNN.reduce((a:any, b:any) => a + b, 0);

  // Mảng thống kê
  const summaryList = [
    { color: '#008000', label: `Cấp 1: Bộ tư lệnh (${sumBoTuLenh})` },
    { color: '#1E90FF', label: `Cấp 2: Cục tác chiến (${sumCucTacChien})` },
    { color: '#FFA500', label: `Cấp 3: TT BTTM, BQP (${sumTTBTTMBQP})` },
    { color: '#FF0000', label: `Cấp 4: LĐ Đảng, Nhà nước (${sumLDangNN})` }
  ];

  return {
    title: "Báo cáo chuyên sâu",
    subTitle: `Tổng: ${totalReports} Báo cáo`,
    categories: converted.map((d: any) => d.target),
    series: [
      { name: "Cấp 1: Bộ tư lệnh", data: capBoTuLenh, color: "rgba(28, 155, 83, 1)" },
      { name: "Cấp 2: Cục tác chiến", data: capCucTacChien, color: "rgba(52, 131, 251, 1)" },
      { name: "Cấp 3: TT BTTM, BQP", data: capTTBTTMBQP, color: "rgba(255, 191, 74, 1)" },
      { name: "Cấp 4: LĐ Đảng, Nhà nước", data: capLDangNN, color: "rgba(239, 62, 46, 1)" }
    ],
    height:height ,
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} báo cáo`;
    },
    isStacked: true,
    summaryList // 🔹 Thêm mảng thống kê
  };
}
