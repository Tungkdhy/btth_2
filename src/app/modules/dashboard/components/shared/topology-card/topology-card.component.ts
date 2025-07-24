import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConnectorConstraints,
  DataBindingService,
  DiagramComponent,
  DiagramModule,
  DiagramTools,
  DiagramTooltipModel,
  HierarchicalTreeService,
  IPropertyChangeEventArgs,
  ISelectionChangeEventArgs,
  NodeConstraints,
  SelectorConstraints,
  SelectorModel,
  SnapConstraints,
  SnapSettingsModel,
  UserHandleModel,
} from '@syncfusion/ej2-angular-diagrams';
import { Constant } from '../../../../../core/config/constant';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-dropdowns';
import { UnitModel } from '../../../../unit/models/unit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PrtgAlertWidgetComponent } from '../../../../../shared/statistical-modal/prtg-alert-widget/prtg-alert-widget.component';
import {
  ConnectorTopology,
  NodeTopologyV2,
  TopologyData,
} from '../../../models/btth.interface';
import { isEqual } from 'lodash-es';
import { DetailDeviceModalComponent } from '../detail-device-modal/detail-device-modal.component';

@Component({
  selector: 'app-topology-card',
  standalone: true,
  imports: [CommonModule, DiagramModule, PrtgAlertWidgetComponent],
  providers: [HierarchicalTreeService, DataBindingService],
  templateUrl: './topology-card.component.html',
  styleUrls: ['./topology-card.component.scss'],
})
export class TopologyCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('diagram')
  public diagram: DiagramComponent;

  @Input() diagramId: string = 'topology-diagram';
  @Input() isView: boolean = true;
  @Output() nodeMoved = new EventEmitter<any>();

  get topologyData(): TopologyData {
    return this._topologyData;
  }

  @Input() set topologyData(value: TopologyData | null) {
    if (
      (this._topologyData && isEqual(this._topologyData, value)) ||
      !value ||
      !value.nodes
    ) {
      if (this.diagram) this.diagram.clear();
      return;
    }

    this._topologyData = value;
    this.insertTopologyData(value);
  }

  private _topologyData: TopologyData;
  @Input() isFullScreen: boolean = false;

  nodes: NodeTopologyV2[];
  connectors: ConnectorTopology[];

  @Input() nodeSearch: any[] = [];

  fields: FieldSettingsModel = { text: 'name', value: 'id' };

  snapSettings: SnapSettingsModel = {
    constraints:
      SnapConstraints.None |
      SnapConstraints.ShowHorizontalLines |
      SnapConstraints.ShowVerticalLines,
  };
  tool: DiagramTools = DiagramTools.ZoomPan;
  handles: UserHandleModel[] = [
    {
      name: 'modal',
      visible: true,
      offset: 0,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
  ];
  selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  isLoading: boolean = true;
  units: UnitModel[] = [];

  handle: UserHandleModel[] = [
    {
      name: Constant.DIAGRAM_TOPOLOGY.NAME.STATISTICAL,
      visible: true,
      backgroundColor: Constant.DIAGRAM_TOPOLOGY.BACKGROUND_COLOR,
      side: 'Left',
      pathColor: Constant.DIAGRAM_TOPOLOGY.PATH_COLOR,
      pathData: Constant.DIAGRAM_TOPOLOGY.PATH_DATA.STATISTICAL,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    {
      name: Constant.DIAGRAM_TOPOLOGY.NAME.DETAIL,
      backgroundColor: Constant.DIAGRAM_TOPOLOGY.BACKGROUND_COLOR,
      pathColor: Constant.DIAGRAM_TOPOLOGY.PATH_COLOR,
      pathData: Constant.DIAGRAM_TOPOLOGY.PATH_DATA.DETAIL,
      side: 'Right',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
  ];

  private modal: NgbModal = inject(NgbModal);
  private subscription$: Subscription = new Subscription();

  constructor() {
    // Bind the methods to ensure correct 'this' context
    this.getNodeDefaults = this.getNodeDefaults.bind(this);
    this.getConnectorDefaults = this.getConnectorDefaults.bind(this);
    this.handleSelectNode = this.handleSelectNode.bind(this);
    this.handleNodeDragging = this.handleNodeDragging.bind(this);
  }

  ngOnInit(): void {
    this.updateToolAndConstraints();
  }

  ngOnDestroy() {
    if (this.diagram) this.diagram.destroy();
    if (this.subscription$) this.subscription$.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.diagram) {
      this.diagram.tool = this.tool;
      this.diagram.dataBind();
    }
  }

  private updateToolAndConstraints(): void {
    this.tool = this.isView
      ? DiagramTools.ZoomPan | DiagramTools.SingleSelect
      : DiagramTools.ZoomPan |
        DiagramTools.SingleSelect |
        DiagramTools.MultipleSelect;

    if (this.diagram) {
      this.diagram.tool = this.tool;
      this.diagram.dataBind();
    }
  }

  fitToPage() {
    setTimeout(() => {
      if (this.diagram) {
        this.diagram.fitToPage({
          mode: 'Page',
          region: 'Content',
          canZoomIn: true,
        });
      }
    }, 5);
  }

  insertTopologyData(data: TopologyData) {
    this.nodes = data.nodes;
    this.connectors = data.connectors;

    if (this.diagram) {
      this.diagram.nodes = this.nodes;
      this.diagram.connectors = this.connectors;
      this.updateNodeConstraints();
      this.diagram.dataBind();
    }
    this.fitToPage();
  }

  private updateNodeConstraints(): void {
    if (!this.diagram) return;

    this.diagram.nodes.forEach((node) => {
      if (this.isView) {
        node.constraints =
          NodeConstraints.InConnect |
          NodeConstraints.Select |
          NodeConstraints.OutConnect |
          NodeConstraints.ReadOnly |
          NodeConstraints.PointerEvents;
      } else {
        node.constraints =
          NodeConstraints.Default |
          NodeConstraints.Drag |
          NodeConstraints.PointerEvents;
      }
    });
    this.diagram.dataBind();
  }

  handleSelectNode(args: ISelectionChangeEventArgs): void {
    if (!this.isView) return;
    if (!args) return;
    if (args.state === 'Changed') {
      const nodeList = args.newValue as unknown as NodeTopologyV2[];
      if (!nodeList) {
        console.log('Topology: No value device!');
        return;
      }
      const currentNode = nodeList[0];
      this.openDetailDeviceCard(currentNode);
    }
  }

  handleNodeDragging(args: IPropertyChangeEventArgs): void {
    // if (this.isView) return;
    // if (args.state === 'Completed') {
    //   this.nodeMoved.emit(args);
    // }
  }

  hasTopologyData(): boolean {
    return this.nodes && this.nodes.length > 0;
  }

  public handleWhenDiagramCreate(): void {
    this.fitToPage();
    this.updateNodeConstraints();
  }

  public tooltip: DiagramTooltipModel = {
    position: 'TopCenter',
    animation: {
      open: { effect: 'FadeZoomIn', delay: 0 },
      close: { effect: 'FadeZoomOut', delay: 0 },
    },
  };

  public getNodeDefaults(node: any): any {
    node.offsetX = node.coor.x ?? 0;
    node.offsetY = node.coor.y ?? 0;

    node.annotations = [{ content: '', offset: { x: 0.5, y: 1.5 } }];

    if (node.annotations.length !== 0) {
      node.constraints = node.constraints & ~NodeConstraints.Tooltip;
      node.annotations[0].content = node.name || '';
      node.annotations[0].style = {
        color: 'black',
        fontSize: 12,
        textWrapping: 'NoWrap',
      };
    }

    node.constraints = this.isView
      ? NodeConstraints.InConnect |
        NodeConstraints.Select |
        NodeConstraints.OutConnect |
        NodeConstraints.ReadOnly |
        NodeConstraints.PointerEvents
      : (NodeConstraints.Default &
          ~NodeConstraints.Rotate &
          ~NodeConstraints.Resize &
          ~NodeConstraints.Tooltip) |
        NodeConstraints.Drag;

    node.width = 40;
    node.height = 40;

    switch (node.type) {
      case Constant.TYPE_DEVICE.ROUTER:
        const category =
          node.category === Constant.CATEGORY_ROUTER.BCTT ? 'BCTT' : 'Cơ yếu';
        node.annotations[0].content = category;
        let routerSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.ROUTER;
        node.shape = { type: 'Native', content: routerSvgAlert };
        break;

      case Constant.TYPE_DEVICE.FIREWALL:
        let firewallSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.FIREWALL;
        node.shape = { type: 'Native', content: firewallSvgAlert };
        break;

      case Constant.TYPE_DEVICE.SWITCH:
        let switchSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.SWITCH;
        node.shape = { type: 'Native', content: switchSvgAlert };
        break;
      default:
        break;
    }

    return node;
  }

  public getConnectorDefaults(connector: any): any {
    connector.targetDecorator = {
      shape: 'None',
    };

    connector.constraints = ConnectorConstraints.None;
    if (connector.style) connector.style.strokeColor = '#5C90DF';
    if (
      connector.annotations &&
      connector.annotations.length !== 0 &&
      connector.annotations[0].style
    ) {
      connector.annotations[0].style.fill = 'white';
    }
    return connector;
  }

  private openDetailDeviceCard(device: NodeTopologyV2): void {
    if (device.type === 'SWITCH') {
      const deviceModal = this.modal.open(DetailDeviceModalComponent, {
        centered: true,
        modalDialogClass: 'dialogClass',
      });
      // TODO: Pass data to child
      deviceModal.componentInstance.serialNumber = device.id;
      deviceModal.componentInstance.type = device.type;
    }
  }
}
