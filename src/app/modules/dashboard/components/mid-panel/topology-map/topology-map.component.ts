import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ConnectorConstraints,
  DiagramConstraints,
  DiagramModule,
  DiagramTools,
  NodeConstraints,
  PortVisibility, SnapConstraints, SnapSettingsModel
} from "@syncfusion/ej2-angular-diagrams";
import {TopologyLinkModel, TopologyNodeModel} from "../../../../topology/models/topology.model";
import {Constant} from "../../../../../core/config/constant";
import {routerAlert} from "../../../../topology/components/diagram-topology/network-shapes-template";

@Component({
  selector: 'app-topology-map',
  standalone: true,
  imports: [CommonModule, DiagramModule],
  templateUrl: './topology-map.component.html',
  styleUrls: ['./topology-map.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class TopologyMapComponent {
  public diagramConstraints: DiagramConstraints = DiagramConstraints.Default;
  tool: DiagramTools = DiagramTools.MultipleSelect | DiagramTools.ZoomPan;
  snapSettings: SnapSettingsModel = {
    constraints:
      SnapConstraints.ShowHorizontalLines | SnapConstraints.ShowVerticalLines,
  };


  public getNodeDefaults(node: TopologyNodeModel): TopologyNodeModel {
    if (node && node.style) {
      node.style.strokeColor = node.status ? '#5C90DF' : 'red';
      node.style.fill = 'transparent';
    }

    node.ports = [
      {
        id: `port-${node.id}`,
        offset: node.isChildUnitExist ? {x: 1, y: 1} : {x: 0.5, y: 0.5},
        visibility: PortVisibility.Hidden,
        shape: 'Circle',
      },
    ];

    node.annotations = [{offset: {x: 0.5, y: 1.5}}];
    node.constraints =
      NodeConstraints.InConnect |
      NodeConstraints.Select |
      NodeConstraints.OutConnect |
      NodeConstraints.ReadOnly |
      NodeConstraints.PointerEvents |
      NodeConstraints.Tooltip;

    if (
      (!node.isChildUnitExist || node.isRouterRoot) &&
      node.annotations.length !== 0 &&
      node.annotations[0].style
    ) {
      node.constraints = node.constraints & ~NodeConstraints.Tooltip;
      node.annotations[0].content = node.name;
      node.annotations[0].style.color = 'black';
      node.annotations[0].style.fontSize = 12;
      node.annotations[0].style = {
        textWrapping: 'NoWrap',
      };
    }

    if (!node.isChildUnitExist) {
      node.width = 40;
      node.height = 40;

      switch (node.deviceType) {
        case Constant.TYPE_DEVICE.ROUTER:
          let routerSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.ROUTER;
          if (node.hasFmsAlert && (node.hasPrtgAlert || !node.status)) {
            routerSvgAlert = routerSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS,
            );
            node.shape = {type: 'Native', content: routerAlert};
          } else if (node.hasPrtgAlert || !node.status) {
            routerSvgAlert = routerSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
            );
          } else if (node.hasFmsAlert) {
            routerSvgAlert = routerSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS,
            );
            node.shape = {type: 'Native', content: routerSvgAlert};
          }
          node.shape = {type: 'Native', content: routerSvgAlert};
          break;

        case Constant.TYPE_DEVICE.FIREWALL:
          let firewallSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.FIREWALL;
          if (!node.status) {
            firewallSvgAlert = firewallSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
            );
          }
          node.shape = {type: 'Native', content: firewallSvgAlert};
          break;

        case Constant.TYPE_DEVICE.SWITCH:
          let switchSvgAlert = Constant.TOPOLOGY_MATERIAL.DEVICE_SVG.SWITCH;
          if (node.hasFmsAlert && !node.status) {
            switchSvgAlert = switchSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG_FMS,
            );
            node.shape = {type: 'Native', content: routerAlert};
          } else if (!node.status) {
            switchSvgAlert = switchSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.PRTG,
            );
          } else if (node.hasFmsAlert) {
            switchSvgAlert = switchSvgAlert.replace(
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.DEFAULT,
              Constant.TOPOLOGY_MATERIAL.ALERT_CLASS.FMS,
            );
          }
          node.shape = {type: 'Native', content: switchSvgAlert};
          break;

        default:
          break;
      }
    }
    return node;
  }

  public getConnectorDefaults(connector: TopologyLinkModel): TopologyLinkModel {
    connector.targetDecorator = {
      shape: 'None',
    };

    connector.sourcePortID = `port-${connector.sourceID}`;
    connector.targetPortID = `port-${connector.targetID}`;

    // connector.constraints =
    //   ConnectorConstraints.ReadOnly |
    //   ConnectorConstraints.Select |
    //   ConnectorConstraints.PointerEvents;
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

}
