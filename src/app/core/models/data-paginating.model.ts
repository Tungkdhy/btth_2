export interface DataPaginatingModel {
  data: any[];
  total: number;
}

export class MoveNodeModel {
  mode: 'LAST_CHILD' | 'FIRST_CHILD' | 'SIBLING';
  nodeId: string;
  destinationNodeId: string;
}
