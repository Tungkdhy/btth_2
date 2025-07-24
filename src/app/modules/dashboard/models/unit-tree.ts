export interface UnitTree {
  id: string;
  name: string;
  parent_id?: string | null;
  description?: string | null;
  address?: string | null;
  address_number?: number | null;
  city?: string | null;
  district?: string | null;
  street?: string | null;
  ward?: string | null;
  icon_id?: string | null;
  sort?: number | null;
  region?: string | null;
  int_id: number;
  path: string;
  int_id_parent?: number | null;
  name_search?: string | null;
  ts?: Date | null;
  icond_id?: number | null;
  long: number;
  lat: number;
}
