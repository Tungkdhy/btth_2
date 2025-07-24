export interface SummaryBlock {
    title: string;
    total: number;
    route?: string; // ✅ đường dẫn muốn chuyển khi click
    items: { label: string; value: number }[];
  }