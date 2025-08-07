export function convertToDataReport(data: any) {
  const order = ["H", "MAI", "IND", "K", "BRN", "TAW", "Khác"];

  return data
    .map((d: any, index: number) => ({
      stt: index + 1,
      direction: d.huong_tc, // chỉ giữ string thôi
      targetType: d.ten_loai_muc_tieu ?? '',
      exploitData: `${d.tong_du_lieu_thu_thap}GB`,
      deepReport: `${d.tong_so_bao_cao} Báo cáo`,
      cap1: d.cap_bao_cao_data?.["Bộ Tư Lệnh"] ?? 0,
      cap2: d.cap_bao_cao_data?.["Cục tác chiến"] ?? 0,
      cap3: d.cap_bao_cao_data?.["TT BTTM, BQP"] ?? 0,
      cap4: d.cap_bao_cao_data?.["LĐ Đảng, Nhà nước"] ?? 0
    }))
    
}