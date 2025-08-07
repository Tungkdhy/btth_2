export function convertToStackChartHoriPOCConfig(data: any,height="390px") {
  // Map tên quốc gia
  const nameMap: any = {
    MAL: "MAI",
    TWN: "TAW"
  };

  // Thứ tự mong muốn
  const order: any = ["H", "MAI", "IND", "K", "BRN", "TAW", "Khác"];

  // Chuẩn hóa & sắp xếp
  const converted: any = data.map((d: any) => ({
    target: nameMap[d.huong_tc] ?? d.huong_tc,
    ...d
  }));

  // CVE
  const cveTrungBinh: any = converted.map((d: any) => d.cve_trung_binh ?? 0);
  const cveCao: any = converted.map((d: any) => d.cve_cao ?? 0);
  const cveNghiemTrong: any = converted.map((d: any) => d.cve_nghiem_trong ?? 0);

  // POC
  const pocTrungBinh: any = converted.map((d: any) => d.poc_trung_binh ?? 0);
  const pocCao: any = converted.map((d: any) => d.poc_cao ?? 0);
  const pocNghiemTrong: any = converted.map((d: any) => d.poc_nghiem_trong ?? 0);

  // Tính tổng để làm subTitle
  const totalCVE: any = converted.reduce((sum: any, d: any) => sum + (d.total_cve_count ?? 0), 0);
  const totalPOC: any = converted.reduce((sum: any, d: any) => sum + (d.total_poc_count ?? 0), 0);
  const totalCombined: any = converted.reduce((sum: any, d: any) => sum + (d.total_combined ?? 0), 0);

  return {
    title: "Lỗ hổng bảo mật - Mã khai thác",
    subTitle: `Tổng: ${totalCombined} (${totalCVE} CVE, ${totalPOC} POC)`,
    categories: converted.map((d: any) => d.target),
    series: [
      // CVE Stack
      { name: "Trung bình", type: "bar", stack: "CVE", barGap: "30%", barCategoryGap: "50%", data: cveTrungBinh, color: "rgba(52, 131, 251, 1)" },
      { name: "Cao", type: "bar", stack: "CVE", data: cveCao, color: "rgba(255, 191, 74, 1)" },
      { name: "Nghiêm trọng", type: "bar", stack: "CVE", data: cveNghiemTrong, color: "rgba(239, 62, 46, 1)" },

      // POC Stack
      { name: "Trung bình", type: "bar", stack: "POC", data: pocTrungBinh, color: "rgba(52, 131, 251, 1)" },
      { name: "Cao", type: "bar", stack: "POC", data: pocCao, color: "rgba(255, 191, 74, 1)" },
      { name: "Nghiêm trọng", type: "bar", stack: "POC", data: pocNghiemTrong, color: "rgba(239, 62, 46, 1)" }
    ],
    height:height ,
    tooltipFormatter: (params: any) => {
      const param: any = params;
      return `${param.name}: ${param.value} mục tiêu ${param.seriesName ?? ""}`;
    },
    legendFormatter: (name: any) => name,
    isStacked: true
  };
}
