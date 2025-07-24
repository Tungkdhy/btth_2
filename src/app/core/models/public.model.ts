export interface UnitMgisPublic {
  name: string;
  id: string;
  code: string;
  namePath: string;
  childCodes: string;
  treeLevel: number;
}

export interface UnitOtherPublic {
  zone: string;
  name: string;
  idOrigin: string;
  parentIdOrigin: string | null;
  hasRef: boolean;
  hasChildren?: boolean;
}

export interface ReferenceStatistics {
  total: number;
  referenced: number;
}

export type AllSystemType = 'mgis' | 'ta21' | 'nms' | 'fms' | 'nac';
export type ReferenceSystemType = Exclude<AllSystemType, 'mgis'>;
