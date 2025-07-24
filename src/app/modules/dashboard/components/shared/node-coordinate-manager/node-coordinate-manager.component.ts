import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FieldsSettingsModel,
  NodeData,
  NodeSelectEventArgs,
  TreeViewModule,
} from '@syncfusion/ej2-angular-navigations';
import {
  DiagramComponent,
  DiagramModule,
  IDraggingEventArgs,
  IPropertyChangeEventArgs,
  NodeModel,
  SelectorModel,
} from '@syncfusion/ej2-angular-diagrams';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, repeat, tap } from 'rxjs';
import {
  TopologySupabaseService,
  TreeNode,
} from '../../../services/topology-supabase.service';
import { TopologyCardComponent } from '../topology-card/topology-card.component';
import {
  MainType,
  MonitoringSystemType,
  TopologyData,
} from '../../../models/btth.interface';
import { MapSupabaseService } from '../../../services/map-supabase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-node-coordinate-manager',
  standalone: true,
  imports: [
    CommonModule,
    TreeViewModule,
    DiagramModule,
    ReactiveFormsModule,
    TopologyCardComponent,
    FormsModule,
  ],
  templateUrl: './node-coordinate-manager.component.html',
  styleUrls: ['./node-coordinate-manager.component.scss'],
})
export class NodeCoordinateManagerComponent implements OnInit {
  @ViewChild('diagram') diagramComponent: DiagramComponent;

  selectedNetworkType: MainType = MainType.MILITARY;
  selectedSystemType: MonitoringSystemType = MonitoringSystemType.NAC;
  selectedUnitId: string | null = null;
  tree$: Observable<TreeNode[]>;

  treeViewFields: FieldsSettingsModel;

  selectedNode: NodeData;
  topology$: Observable<TopologyData | null>;
  coordinateForm: FormGroup;
  protected readonly MainType = MainType;

  private topologyService = inject(TopologySupabaseService);
  private mapSupabase = inject(MapSupabaseService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastrService);

  constructor() {}

  addNode(nodeData: any): void {
    const nodeGroup = this.fb.group({
      id: [nodeData.id],
      name: [nodeData.name],
      x: [nodeData.xCoordinate],
      y: [nodeData.yCoordinate],
    });

    this.nodeCoordinatesFormArray.push(nodeGroup);
  }

  clearNodes(): void {
    this.nodeCoordinatesFormArray.clear();
  }

  ngOnInit() {
    this.initForm();
    this.initTreeView();

    this.tree$ = this.topologyService.fetchUnits().pipe(
      tap((data: any[]) => {
        this.treeViewFields.dataSource = data;
      }),
    );
  }

  initForm() {
    this.coordinateForm = this.fb.group({
      nodeCoordinates: this.fb.array([]),
    });
  }

  initTreeView() {
    this.treeViewFields = {
      dataSource: [],
      id: 'id',
      text: 'name',
      child: 'children',
    };
  }

  handleSelected(event: NodeSelectEventArgs) {
    if (event && event.nodeData) {
      this.selectedNode = event.nodeData as unknown as NodeData;
      this.selectedUnitId = this.selectedNode.id;
      this.topology$ = this.getTopologyData(
        this.selectedSystemType,
        this.selectedNode.id,
        this.selectedNetworkType,
      );
    }
  }

  getTopologyData(
    systemType: MonitoringSystemType = MonitoringSystemType.NAC,
    unitPath: string,
    mainType: MainType,
  ): Observable<TopologyData | null> {
    return this.mapSupabase
      .getTopologyDataBySystem(systemType, unitPath, mainType)
      .pipe(
        tap((data) => {
          if (!data || !data.nodes || data.nodes.length === 0) return;
          this.clearNodes();
          const nodes = data.nodes;

          nodes.forEach((item) => {
            this.addNode({
              id: item.id,
              name: item.name,
              xCoordinate: item.coor.x,
              yCoordinate: item.coor.y,
            });
          });
        }),
        repeat(2),
      );
  }

  get nodeCoordinatesFormArray() {
    return this.coordinateForm.get('nodeCoordinates') as FormArray;
  }

  onSubmit() {
    this.topologyService
      .upsertTopologyCoordinates(
        this.coordinateForm.get('nodeCoordinates')?.value,
      )
      .then(() => {
        this.toast.success('Success');
      })
      .catch(() => {
        this.toast.error('Lỗi cập nhật toạ độ');
      });
  }

  updateNodeCoordinates(id: string, x: number, y: number) {
    const nodeCoordinates = this.coordinateForm.get(
      'nodeCoordinates',
    ) as FormArray;
    const nodeIndex = nodeCoordinates.controls.findIndex(
      (control) => control.get('id')?.value === id,
    );

    if (nodeIndex > -1) {
      nodeCoordinates.at(nodeIndex).patchValue({ x, y });
    } else {
      nodeCoordinates.push(this.fb.group({ id, x, y }));
    }
  }

  handleNodeMoved(args: IDraggingEventArgs) {
    if (args.state === 'Completed') {
      let nodeId;
      const x = args.newValue.offsetX;
      const y = args.newValue.offsetY;

      if (this.isNodeModel(args.source)) {
        // Handle NodeModel
        const node = args.source as NodeModel;
        nodeId = node.id;
      } else if (this.isSelectorModel(args.source)) {
        // Handle SelectorModel
        const selector = args.source as SelectorModel;
        if (selector.nodes) {
          nodeId = selector.nodes[0].id;
        }
      }
      if (nodeId && x && y) this.updateNodeCoordinates(nodeId, x, y);
    }
  }

  isNodeModel(source: any): source is NodeModel {
    // Add more conditions if necessary to refine the check
    return (source as NodeModel).id !== undefined;
  }

  isSelectorModel(source: any): source is SelectorModel {
    // Check for properties specific to SelectorModel
    return (source as SelectorModel).selectedObjects !== undefined;
  }

  onTypeChange(type: 'network' | 'system', value: string): void {
    if (type === 'network') {
      this.selectedNetworkType = value as MainType;
    } else if (type === 'system') {
      this.selectedSystemType = value as MonitoringSystemType;
    }

    if (this.selectedUnitId) {
      this.topology$ = this.getTopologyData(
        this.selectedSystemType,
        this.selectedUnitId,
        this.selectedNetworkType,
      );
    }
  }

  onNetworkTypeChange(mainType: string): void {
    this.onTypeChange('network', mainType);
  }

  onSystemTypeChange(systemType: string): void {
    this.onTypeChange('system', systemType);
  }

  protected readonly MonitoringSystemType = MonitoringSystemType;
}
