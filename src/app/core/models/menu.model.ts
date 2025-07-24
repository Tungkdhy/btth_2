export interface MenuModel {
  uuid: string;
  active?: boolean;
  name: string;
  faIcon?: string;
  code: string;
  codeSSO: string;
  description?: string;
  isDefault?: boolean;
  index?: number;
  routerPath: string;
  parentId: string | null;
  componentName?: string;
  isParent?: boolean;
  isExpanded?: boolean;
  subModule: MenuModel[];

  selected?: boolean;
}


