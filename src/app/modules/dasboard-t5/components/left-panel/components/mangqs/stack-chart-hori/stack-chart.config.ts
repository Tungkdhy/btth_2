export interface StackChartConfig {
    title?: string;
    subTitle?: string;
    categories: string[];
    series: {
      name?: string;
      data?: number[];
      color?: string | string[]; 
      itemStyle?: any;
    }[];
    height?: string;
    tooltipFormatter?: (params: any) => string;
    legendFormatter?: (params: any) => string;
    isStacked ?:boolean;
    // orient:"horizontal" // << thêm dòng này
  }
  