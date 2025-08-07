import { Subtitle } from "@syncfusion/ej2-angular-charts";

type AttackData = {
  huong_tc: string;
  chua_khai_thac: number;
  khai_thac_co_ban: number;
  duy_tri_ket_noi: number;
  tham_nhap_sau: number;
  tan_cong_pha_huy: number;
  total_targets: number;
  global_chua_khai_thac: number;
  global_khai_thac_co_ban: number;
  global_duy_tri_ket_noi: number;
  global_tham_nhap_sau: number;
  global_tan_cong_pha_huy: number;
  global_total: number;
};

export function convertToStackChartConfig(data: AttackData[] | any,height='330px') {
  const nameMap: Record<string, string> = {
    MAL: "MAI",
    TWN: "TAW",
  };

  const categories = data.map((d: any) => nameMap[d.huong_tc] ?? d.huong_tc);

  const khaiThacCoBan = data.map((d: any) => d.khai_thac_co_ban);
  const duyTriKetNoi = data.map((d: any) => d.duy_tri_ket_noi);
  const thamNhapSau = data.map((d: any) => d.tham_nhap_sau);
  const tanCongPhaHuy = data.map((d: any) => d.tan_cong_pha_huy);

  // ===== Tính tổng =====
  const totalKhaiThac = data.reduce(
    (sum: number, d: any) =>
      sum + d.khai_thac_co_ban + d.duy_tri_ket_noi + d.tham_nhap_sau + d.tan_cong_pha_huy,
    0
  );
  const totalTargets = data.reduce((sum: number, d: any) => sum + d.total_targets, 0);

  // ===== Thống kê từng mức =====
  const sumLevel1 = khaiThacCoBan.reduce((a:any, b:any) => a + b, 0);
  const sumLevel2 = duyTriKetNoi.reduce((a:any, b:any) => a + b, 0);
  const sumLevel3 = thamNhapSau.reduce((a:any, b:any) => a + b, 0);
  const sumLevel4 = tanCongPhaHuy.reduce((a:any, b:any) => a + b, 0);

  const statsList = [
    { color: '#008000', label: `Mức 1: K.Thác cơ bản (${sumLevel1})` },
    { color: '#1E90FF', label: `Mức 2: Duy trì kết nối (${sumLevel2})` },
    { color: '#FFA500', label: `Mức 3: Thâm nhập sâu (${sumLevel3})` },
    { color: '#FF0000', label: `Mức 4: Tấn công phá huỷ (${sumLevel4})` }
  ];

  const stackChartConfig = {
    title: `Biểu đồ khai thác`,
    subTitle:`Tổng:(${totalKhaiThac}/${totalTargets})`, 
    categories,
    series: [
      { name: "Mức 1 K.Thác cơ bản", data: khaiThacCoBan, color: '#008000' },
      { name: "Mức 2 Duy trì kết nối", data: duyTriKetNoi, color: '#1E90FF' },
      { name: "Mức 3 Thâm nhập sâu", data: thamNhapSau, color: '#FFA500' },
      { name: "Mức 4 Tấn công phá hủy", data: tanCongPhaHuy, color: '#FF0000' }
    ],
    height: height,
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu`;
    },
    isStacked: true,
    summary: {
      khaiThac: totalKhaiThac,
      targets: totalTargets
    },
    statsList // thêm list thống kê
  };

  return stackChartConfig;
}
