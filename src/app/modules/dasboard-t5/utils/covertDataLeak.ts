import { PipeChartConfig } from "../components/shared/pie-chart/pipe-chart.config"

export function convertToDataLeak(rawData:any) {
  // Hàm format ngày từ YYYYMMDDHHmmss sang dd/MM/yyyy
  const formatDate = (dateStr: string) => {
    const y = dateStr.slice(0, 4)
    const m = dateStr.slice(4, 6)
    const d = dateStr.slice(6, 8)
    return `${d}/${m}/${y}`
  }

  // Hàm map chủ quan
  const mapChuQuan = (code: string) => {
    switch (code) {
      case "BBN":
        return "Bộ, Ban Ngành"
      default:
        return code // Giữ nguyên VPQH, VPCP, Quân đội, Khác,...
    }
  }

  // Chuyển đổi
  return rawData.data.records.map((item:any, index:number) => ({
    stt: index + 1,
    "tt lộ lọt": item.tong_quan_lo_lot,
    "ngày": formatDate(item.ngay_bi_lo_lot),
    "chủ quan": mapChuQuan(item.he_thong)
  }))
}
export function convertStatsToChartConfig(input: any,height="'380px'"):PipeChartConfig {
  // Màu cố định cho từng hệ thống
  const colorMap: Record<string, string> = {
    'BBN': 'rgba(28, 155, 83, 1)',
    'VPQH': 'rgba(52, 131, 251, 1)',
    'VPCP': 'rgb(221, 161, 31)',
    'Quân đội': 'rgba(210, 0, 26, 1)',
    'Khác': 'rgb(140, 119, 119)'
  }

  // Thứ tự cố định
  const order = ['BBN', 'VPQH', 'VPCP', 'Quân đội', 'Khác']

  // Sắp xếp và map dữ liệu
  const data = order
    .map(name => {
      const found = input.data.he_thong_summary.by_system.find((s:any) => s.he_thong === name)
      if (!found) return null
      return {
        value: found.total_records,
        name,
        itemStyle: { color: colorMap[name] || '#ccc' }
      }
    })
    .filter(Boolean) as { value: number; name: string; itemStyle: { color: string } }[]

  return {
    data,
    title: '',
    colors: ['#ff4d4f', '#40a9ff', '#73d13d'],
    legendPosition: 'bottom',
    radius: ['30%', '55%'],
    showLabelInside: false,
    height: height,
    legend: false,
    subTitle:'Tổng: '+ input.pagination.total_count
  }
}