import {
  Document,
  HeadingLevel,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from 'docx';
import { IDeviceDto } from 'src/app/modules/device/models/device.model';
import { IEndPointDto } from 'src/app/modules/endpoint/models/endpoint.model';
import { UnitDetailModel } from 'src/app/modules/unit/models/unit.model';
import { convertToDateFormatVI } from '../../app/_metronic/layout/core/common/common-utils';
import { AlertESModel } from '../../app/modules/fms/models/alertESModel';

export class NetworkRecordGenerator {
  public create(unitDetail: UnitDetailModel): Document {
    return new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'I. Hồ sơ hạ tầng mạng',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: '1. Thiết bị mạng',
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              text: '1.1. Router',
              heading: HeadingLevel.HEADING_4,
            }),
            this.createDeviceTable(unitDetail.routers),

            new Paragraph({
              text: '1.2. Switch',
              heading: HeadingLevel.HEADING_4,
            }),
            this.createDeviceTable(unitDetail.switches),

            new Paragraph({
              text: '1.3. Firewall',
              heading: HeadingLevel.HEADING_4,
            }),
            this.createDeviceTable(unitDetail.firewalls),

            new Paragraph({
              text: '2. Máy tính',
              heading: HeadingLevel.HEADING_3,
            }),
            this.createEndpointTable(unitDetail.endpoints),

            new Paragraph({
              text: 'II. Cảnh báo',
              heading: HeadingLevel.HEADING_2,
            }),
            this.createAlertTable(unitDetail.alerts),
          ],
        },
      ],
    });
  }

  createDeviceTable(devices: IDeviceDto[]): Table {
    const header = new TableRow({
      children: [
        new TableCell({
          width: {
            size: 350,
            type: WidthType.DXA,
          },
          children: [new Paragraph('STT')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Tên')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Đơn vị')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('IP quản trị')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Loại')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Trạng thái')],
        }),
      ],
    });
    const table = new Table({
      rows: [header],
    });
    if (!devices) return table;

    for (let index = 0; index < devices.length; index++) {
      let item = devices[index];
      const row = new TableRow({
        children: [
          new TableCell({
            width: {
              size: 350,
              type: WidthType.DXA,
            },
            children: [new Paragraph((index + 1).toString())],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.name ? item.name : 'Chưa quản lý')],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.unitName ? item.unitName : '')],
          }),
          new TableCell({
            width: {
              size: 1200,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(item.managementIp ? item.managementIp : ''),
            ],
          }),
          new TableCell({
            width: {
              size: 1200,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(item.vendor ? item.vendor : ''),
              new Paragraph(item.model ? item.model : ''),
            ],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.status ? 'Kết nối' : 'Mất kết nối')],
          }),
        ],
      });
      table.addChildElement(row);
    }
    return table;
  }

  createEndpointTable(devices: IEndPointDto[]): Table {
    const header = new TableRow({
      children: [
        new TableCell({
          width: {
            size: 350,
            type: WidthType.DXA,
          },
          children: [new Paragraph('STT')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Người quản lý')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Địa chỉ MAC/IP')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Đơn vị')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Trạng thái')],
        }),
      ],
    });
    const table = new Table({
      rows: [header],
    });
    if (!devices) return table;

    for (let index = 0; index < devices.length; index++) {
      let item = devices[index];
      const row = new TableRow({
        children: [
          new TableCell({
            width: {
              size: 350,
              type: WidthType.DXA,
            },
            children: [new Paragraph((index + 1).toString())],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.name ? item.name : '')],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.mac), new Paragraph(item.ip)],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.unit ? item.unitNamePath : '')],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.status ? 'Kết nối' : 'Mất kết nối')],
          }),
        ],
      });
      table.addChildElement(row);
    }
    return table;
  }
  createAlertTable(alerts: AlertESModel[]): Table {
    const header = new TableRow({
      children: [
        new TableCell({
          width: {
            size: 350,
            type: WidthType.DXA,
          },
          children: [new Paragraph('STT')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Người quản lý')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Đơn vị')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('MAC/IP')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Thời gian')],
        }),
        new TableCell({
          width: {
            size: 1000,
            type: WidthType.DXA,
          },
          children: [new Paragraph('Mô tả')],
        }),
      ],
    });
    const table = new Table({
      rows: [header],
    });
    if (!alerts) return table;

    for (let index = 0; index < alerts.length; index++) {
      let item = alerts[index];
      const row = new TableRow({
        children: [
          new TableCell({
            width: {
              size: 350,
              type: WidthType.DXA,
            },
            children: [new Paragraph((index + 1).toString())],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(
                item.employeeName ? item.employeeName : 'Chưa quản lý',
              ),
            ],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(item.unitNamePath ? item.unitNamePath : ''),
            ],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(item.sourceMac),
              new Paragraph(item.sourceIp),
            ],
          }),
          new TableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            children: [
              new Paragraph(
                item.detectionDate
                  ? convertToDateFormatVI(item.detectionDate)
                  : '',
              ),
            ],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            children: [new Paragraph(item.description)],
          }),
        ],
      });
      table.addChildElement(row);
    }
    return table;
  }
}
