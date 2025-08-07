export function convertToNonStackChartConfig(data: any,height='430px') {
  // Map tên quốc gia
  const nameMap: Record<string, string> = {
    MAL: 'MAI',
    TWN: 'TAW'
  };

  // Đổi tên quốc gia nếu cần
  const converted = data.map((d:any) => ({
    target: nameMap[d.huong_tc] ?? d.huong_tc,
    collected: d.du_lieu_thu_thap,
    targetsCount: d.so_luong_muc_tieu,
    systemTotal: d.tong_du_lieu_he_thong
  }));

  // Sắp xếp theo categories bạn mong muốn
  const order = ['H', 'MAI', 'IND', 'K', 'BRN', 'TAW', 'Khác'];
  converted.sort((a:any, b:any) => order.indexOf(a.target) - order.indexOf(b.target));

  // Mảng categories
  const categories = converted.map((d:any) => d.target);

  // Mảng dữ liệu
  const seriesData = converted.map((d:any) => d.collected);

  // Tính tổng dữ liệu thu thập (ví dụ GB)
  const totalCollected = seriesData.reduce((sum:any, val:any) => sum + val, 0);

  // Config chart
  return {
    title: 'Dữ liệu thu thập',
    subTitle: `Tổng: ${totalCollected} GB`,
    height: height,
    isStacked: false,
    categories,
    series: [
      {
        data: seriesData,
        itemStyle: {
          color: (params: any) => {
            // Có thể gán màu động theo target
            const colorList = categories.map(() => 'rgba(52, 131, 251, 1)');
            return colorList[params.dataIndex];
          }
        }
      }
    ]
  };
}
