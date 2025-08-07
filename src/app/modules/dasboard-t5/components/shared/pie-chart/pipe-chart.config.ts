export interface PipeChartConfig {
    data: { name: string; value: number,itemStyle?:any }[]; 
    title?: string;
    colors?: string[];
    legendPosition?: 'left' | 'right' | 'top' | 'bottom';
    radius?: string | [string, string];
    showLabelInside?: boolean;
    height?: string;
    legend?:boolean,
    showLegend?: boolean,
    subTitle?:string // thêm height custom nếu cần
  }