import { InfraAlertData, OverviewStatistics } from '../models/btth.interface';
import { Constant } from '../../../core/config/constant';

export function getType(data?: any) {
  if (!data.type) return '';

  let key: any = {
    PORTAL: 'Ứng dụng, dịch vụ',
    ROUTER:
      data?.category == 'ROUTER_CY' ? 'Thiết bị cơ yếu' : 'Thiết bị định tuyến',
    SWITCH: 'Thiết bị chuyển mạch',
    FIREWALL: 'Thiết bị tường lửa',
    COMMON: 'Ứng dụng, dịch vụ',
  };
  return key[data.type] || `Hệ thống giám sát ${data.type.toUpperCase()}`;
}

export function getTypeNetwork(type?: string) {
  if (!type) return '';
  let key: any = {
    QS: 'Quân sự',
    INT: 'Internet',
    CD: 'Chuyên dùng',
  };
  return key[type] || '';
}

export function getIpTenMien(data?: any) {
  return data?.ip || data?.managementIp || data?.description || '';
}

export function getLastActive(data: any) {
  let a = data?.lastUp || data?.lastActive || '';
  return a;
}

export function getValueAlertType(name?: any) {
  if (!name) return '';
  let key: any = {
    MALWARE: 'Mã độc',
    BLACK_DOMAIN: 'Tên miền độc hại',
    INTERNET: 'Kết nối Internet',
    HUNTING: 'Bất thường',
  };
  return key[name] || '';
}

export function getRegionName(name?: string) {
  if (!name) return '';
  let key: any = {
    A40: 'Miền Bắc',
    A91: 'Miền Trung',
    A99: 'Miền Nam',
  };
  return key[name];
}

export function getIpTenMienV1(data: any) {
  return data?.ip || data?.managementIp || data?.description || '';
}

export function getIpFromAlert(data: InfraAlertData) {
  return data?.description || '';
}

export function getUnitNameOfDutyRoster(name?: string) {
  if (!name) return '';
  let key: any = {
    A40: 'T1',
    A91: 'T3',
    A99: 'T2',
  };
  return key[name];
}

export function convertSystemAlert(code: string): string | undefined {
  const foundItem = Constant.SYSTEM_ALERTS.find((item) => item.code === code);
  return foundItem ? foundItem.name : undefined;
}

export function convertSecurityAlert(code: string): string | undefined {
  const foundItem = Constant.SECURITY_ALERTS.find((item) => item.code === code);
  return foundItem ? foundItem.name : undefined;
}

export function sortOverviewStatistics(
  overviewStats: OverviewStatistics[],
): OverviewStatistics[] {
  return overviewStats.sort((a, b) => {
    const sortA = a.sort ?? 0; // Giá trị mặc định là 0 nếu sort là null
    const sortB = b.sort ?? 0; // Giá trị mặc định là 0 nếu sort là null
    return sortA - sortB;
  });
}
