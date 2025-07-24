import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceCoordinate } from '../models/btth.interface';

export interface UnitItem {
  path: string;
  name: string;

  [key: string]: any;
}

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data?: UnitItem;
}

@Injectable({
  providedIn: 'root',
})
export class TopologySupabaseService extends SupabaseService {
  fetchUnits(): Observable<any> {
    const builder = this.supabase
      .schema('btth')
      .from('view_unit')
      .select()
      .order('path');
    return from(this.fetchDataByBuilder(builder)).pipe(
      map((data) => {
        return this.buildTree(data);
      }),
    );
  }

  upsertTopologyCoordinates(deviceCoors: any[]): Promise<any> {
    const newValue = deviceCoors.map((item) => ({
      serial_number: item.id,
      x: item.x,
      y: item.y,
    }));
    const builder = this.supabase
      .schema('btth')
      .from('device_coor')
      .upsert(newValue, { onConflict: 'serial_number' })
      .select();
    return this.executeByBuilder(builder);
  }

  buildTree(data: UnitItem[]): TreeNode[] {
    const rootNodes: TreeNode[] = [];
    const lookup: { [key: string]: TreeNode } = {};

    data.forEach((item) => {
      if (!item.path) {
        console.error(
          'Unit: Error falsy path!',
          {
            name: item.name,
            id: item.id,
          },
          item,
        );
        return;
      }
      const segments = item.path.split('.');
      const id = segments[segments.length - 1];

      const node: TreeNode = {
        id: item.path,
        name: item.name_short,
        data: item,
        children: [],
      };

      lookup[item.path] = node;

      if (segments.length === 1) {
        rootNodes.push(node);
      } else {
        const parentPath = segments.slice(0, -1).join('.');
        const parentNode = lookup[parentPath];
        if (parentNode) {
          parentNode.children!.push(node);
        }
      }
    });

    return rootNodes;
  }
}
