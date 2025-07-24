export interface FormUtilitiesModel {

}

export interface ColumnHeadingModel {
  code: string;
  name: string;
}

export interface ColumnFieldsTreeGridSyncfusion {
  field: string;
  headerText: string;
  textAlign?: string;
  width?: string;
}

export class CommonTreeModel {
  uuid: string;
  id: string;
  name: string;
  children: CommonTreeModel[];
  selected?: boolean;
}
