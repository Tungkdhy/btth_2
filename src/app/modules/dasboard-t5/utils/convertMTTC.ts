function   getLevelOnly(name: string): string {
    const parts = name.split(' ');  // Tách theo dấu cách
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name;
  }
export function convertToStackChartExploitConfig(data: any,height ='370px') { 
  // Chuyển đổi dữ liệu sang dạng dùng cho chart
  const converted = data.map((d:any) => ({
    target: d.huong_tc,
    current: d.da_khai_thac_thanh_cong,
    non_current: d.dang_tien_hanh_khai_thac,
    total: d.total_targets
  }));

  // Tính tổng đã khai thác và tổng mục tiêu
  const totalCurrent = converted.reduce((sum:any, item:any) => sum + item.current, 0);
  const totalTargets = converted.reduce((sum:any, item:any) => sum + item.total, 0);

  return {
    title: `Mục tiêu tác chiến`, // gộp vào tiêu đề
    categories: converted.map((d:any) => d.target),
    subTitle:`Tổng: ${totalCurrent}/${totalTargets}`,
    isStacked: true,
    series: [
      {
        name: 'Đã khai thác thành công',
        data: converted.map((d:any) => d.current),
        color: 'rgba(28, 155, 83, 1)'
      },
      {
        name: 'Đang tiến hành khai thác',
        data: converted.map((d:any) => d.non_current),
        color: '#045e2b'
      }
    ],
    height: height,
    tooltipFormatter: (params: any) => {
      const param = params;
      return `${param.name}: ${param.value} mục tiêu ${getLevelOnly(param.seriesName ?? '')}`;
    },
    legendFormatter: (name: string) => name,
    summary: {
      current: totalCurrent,
      total: totalTargets
    }
  };
}