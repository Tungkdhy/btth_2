// import { UnitDetailIntegrationModel } from '../../../../modules/unit/models/unit-detail-integration.model';
import { EventTypeFMS } from '../../../../core/models/fms.model';
import { Constant } from '../../../../core/config/constant';
import { from, groupBy, Observable, reduce } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  LayerIds,
  NetworkInfrastructureTreeCount,
  Period,
} from '../../../../modules/dashboard/models/btth.interface';

export function convertToDateFormatVI(
  date: string | number | null | undefined,
): string {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(date).toLocaleDateString('vi-VI', options);
}

export const formatDate = (date: Date) => {
  const isoDate = date.toISOString();
  return isoDate.split('T')[0];
};

export const formatDateTime = (date: Date | number | null | undefined) => {
  if (!date) return '';
  if (typeof date === 'number') date = new Date(date);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`; // Example: '2020-01-01 00:00:00'
};

/* ------------------tctt--------------- */
function isEndOfMonth(date: Date): boolean {
  // Create a new date for the first day of the next month
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  // Subtract 1 day from the first day of the next month to get the last day of the current month
  nextMonth.setDate(nextMonth.getDate() - 1);

  // Check if the given date is the same as the last day of the current month
  return date.getDate() === nextMonth.getDate();
}

export const isTheFollowingDay = (
  startDay: Date | string,
  endDay: Date | string,
  thresholdDay: number,
  prevThresholdDay?: number,
): String => {
  if (startDay && endDay) {
    const start = new Date(startDay);
    const end = new Date(endDay);
    if (start.getDate() + 1 === end.getDate()) {
      if (start.getMonth() === end.getMonth()) {
        if (
          end.getHours() === thresholdDay
        ) {
          return '0';
        }
        return '1';
      }
    } else {
      if (
        start.getMonth() + 1 === end.getMonth() &&
        end.getDate() === 1 &&
        isEndOfMonth(start)
      ) {
        if (end.getHours() <= thresholdDay) {
          return '0';
        }
        return '1';
      } else {
        if (
          start.getFullYear() + 1 === end.getFullYear() &&
          end.getMonth() === 0 &&
          end.getDate() === 1 &&
          isEndOfMonth(start)
        ) {
          if (end.getHours() <= thresholdDay) {
            return '0';
          }
          return '1';
        }
      }
    }
    return '2';
  }
  return '3';
};

export const getDateRangePayload = (
  startDate: Date | string,
  endDate: Date | string,
  type: string,
) => {
  const thresholdDay: number = 23;
  const formattedStartDate = formatDateTime(new Date(startDate)).split(' ')[0];
  const formattedEndDate = formatDateTime(new Date(endDate)).split(' ')[0];

  if (type === '0') {
    if (isTheFollowingDay(startDate, endDate, thresholdDay) === '0') {
      return {
        startDate: formattedStartDate,
        endDate: formattedStartDate,
      };
    } else if (
      isTheFollowingDay(formattedStartDate, formattedEndDate, thresholdDay) ===
      '1'
    ) {
      return {
        startDate: formattedEndDate,
        endDate: formattedEndDate,
      };
    }
    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  } else if (type === '2') {
    const fullStartDateFormat = new Date(startDate);
    const fullEndDateFormat = new Date(endDate);

    return {
      startDate: fullStartDateFormat,
      endDate: fullEndDateFormat,
    };
  } else {
    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }
};

export const isNaNDateFormat = (
  startDate: Date | string,
  endDate: Date | string,
) => {
  const convertedStartDate = new Date(startDate);
  const convertedEndDate = new Date(endDate);

  if (
    isNaN(convertedStartDate.getTime()) &&
    isNaN(convertedEndDate.getTime())
  ) {
    return true;
  } else {
    return false;
  }
};

export const getAreaPayload = (payload: string) => {
  if (payload === undefined) {
    return '0';
  }

  const area = payload;
  // Mapping of areas to corresponding area codes
  const areaMap: { [key: string]: string } = {
    north: '1',
    central: '2',
    south: '3',
    all: '0',
  };
  return areaMap[area];
};

export const convertFormatDateTimeTctt = (value: string | Date) => {
  const dateObj = new Date(value);

  const day = dateObj.getDate().toString().padStart(2, '0');
  let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  if (parseInt(month) > 2 && parseInt(month) < 10) {
    month = `${parseInt(month)}`;
  }
  return `${day}/${month}`;
};
/* ------------------tctt--------------- */
export function formatNumberWithDot(num: number | string | number[]): string {
  if (!num) return '';
  if (Array.isArray(num)) {
    return num
      .map((item) => item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
      .join(' - ');
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const formatDateForElasticsearch = (date: Date) => {
  return formatDateTime(date).replace(' ', 'T');
};

export const deepCopyUseJSON = (data: any): any => {
  return JSON.parse(JSON.stringify(data));
};

export const extractParentAndUnitName = (
  input: string,
  ignoreFirstElm?: boolean,
): { parentUnitName: string; unitName: string } => {
  const parts = input.split('/');
  const parentUnitName = parts.slice(ignoreFirstElm ? 1 : 0, -1).join('/');
  const unitName = parts[parts.length - 1].trim();
  return { parentUnitName, unitName };
};

// export function getHighestTreeLevelUnit(
//   units: UnitDetailIntegrationModel[],
// ): UnitDetailIntegrationModel {
//   let highestLevelUnit = units[0];
//   let highestLevel = Number.MAX_SAFE_INTEGER;

//   units.forEach((unit) => {
//     if (unit.treeLevel < highestLevel) {
//       highestLevel = unit.treeLevel;
//       highestLevelUnit = unit;
//     }
//   });

//   return highestLevelUnit;
// }

export function isNullStringData(value: string | null | undefined): any {
  if (value === null || value === undefined || value.trim() === '') {
    return true;
  }
  return false;
}

// export function getUnitById(
//   units: UnitDetailIntegrationModel[],
//   id: string,
// ): UnitDetailIntegrationModel | undefined {
//   return units.find((item) => item.id === id);
// }

export const getCustomDateTime = (
  date: Date,
  hour: number,
  minute: number,
  second: number,
): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    second,
  );
};

export function separateUnitName(
  name: string | undefined,
  ignoreFirstElm?: boolean,
): string[] {
  if (!name) return [];
  const firstIndex = ignoreFirstElm ? name.indexOf('/') + 1 : 0;
  const lastIndex = name.lastIndexOf('/');
  return [name.slice(firstIndex, lastIndex), name.slice(lastIndex + 1)];
}

export function convertToUnsigned(str: string): string {
  const mapping: { [key: string]: string } = {
    á: 'a',
    à: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ắ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ấ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    đ: 'd',
    Đ: 'D',
    é: 'e',
    è: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ế: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    í: 'i',
    ì: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ó: 'o',
    ò: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ố: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ớ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ú: 'u',
    ù: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ứ: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ý: 'y',
    ỳ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
  };

  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, (matched) => mapping[matched] || matched)
    .toLowerCase();
}

export const convertToUnsignedAndDash = (url: string): string => {
  return convertToUnsigned(url).replace(/[\s]/g, '-');
};

export const convertToDash = (...url: string[]): string => {
  return url.reduce(
    (accumulator: string, currentValue: string) =>
      `${accumulator} - ${currentValue}`,
  );
};

export const convertToUrl = (...url: string[]): string => {
  return url
    .map((item: string) => convertToUnsignedAndDash(item))
    .reduce(
      (accumulator: string, currentValue: string) =>
        `${accumulator}/${currentValue}`,
      '',
    );
};

export function toFormData(formValue: any) {
  const formData = new FormData();
  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    if (value !== null) formData.append(key, value);
  }

  return formData;
}

/**
 * Checks if a given date is greater than a specified number of days from the current date.
 *
 * @param date - The date to compare.
 * @param days - The number of days to compare against.
 * @returns `true` if the date is greater than the specified number of days from the current date, otherwise `false`.
 */
export function isDateGreaterThanDays(
  date: Date | string | null,
  days: number,
): boolean {
  if (!date) return true;
  const givenDate = new Date(date);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);
  return dayDifference > days;
}

export function translateAlertFms(event: EventTypeFMS) {
  switch (event) {
    case 'BLACK_DOMAIN':
      return Constant.ASSETS.FMS.TRANSLATE.BLACK_DOMAIN;
    case 'POLICY':
      return Constant.ASSETS.FMS.TRANSLATE.POLICY;
    case 'MALWARE':
      return Constant.ASSETS.FMS.TRANSLATE.MALWARE;
    default:
      return 'Chưa xác định';
  }
}

export function decodeBase64(base64String: string): string {
  // Remove data URL prefix
  const base64Data = base64String.split(',')[1];
  // Decode base64 data
  return atob(base64Data);
}

export function fetchAndMapData<T>(
  fetchFunction: (...args: any[]) => Promise<any>,
  mapFunction: (data: any) => T[],
  ...fetchArgs: any[]
): Observable<T[]> {
  return from(fetchFunction(...fetchArgs)).pipe(map(mapFunction));
}

export function groupAndSumByLayer(
  data: Observable<NetworkInfrastructureTreeCount[]>,
  layerId: LayerIds,
): Observable<{ name: string | null; total: number }[]> {
  return data.pipe(
    mergeMap((endpointCounts) => from(endpointCounts)),
    filter((item) => !!item.coreLayerName),
    groupBy((item) => {
      switch (layerId) {
        case LayerIds.CORE:
          return item.coreLayerName;
        case LayerIds.BOUNDARY:
          return item.boundaryLayerName;
        case LayerIds.ACCESS:
          return item.unitPath;
        default:
          return item.unitPath;
      }
    }),
    mergeMap((group$) =>
      group$.pipe(
        reduce((acc, curr) => acc + curr.total, 0),
        map((total) => ({
          name: group$.key,
          total: total,
        })),
      ),
    ),
    reduce((acc: any[], curr: any) => [...acc, curr], []),
  );
}

export function extractLevelFromPath(path: string, level: number): string {
  const parts = path.split('.');
  if (parts.length >= level) {
    return parts.slice(0, level).join('.');
  }
  return path;
}

/**
 * Returns the parent path of a given ltree path.
 *
 * @param path - The ltree path (e.g., 'a.b.c').
 * @returns The parent path (e.g., 'a.b') or an empty string if there's no parent.
 */
export function getPathParentFromLTree(path: string): string {
  // Split the path into segments by the dot character
  const segments = path.split('.');

  // If there's only one segment, there's no parent path
  if (segments.length <= 1) {
    return '';
  }

  // Remove the last segment to get the parent path
  segments.pop();

  // Join the remaining segments to form the parent path
  return segments.join('.');
}

/**
 * Converts a Date object to the format 'dd-MM-yyyy HH:mm:ss'.
 * @param date - The Date object to format.
 * @returns A string representing the date and time in 'dd-MM-yyyy HH:mm:ss' format.
 */
export function formatDateVI(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0'); // Helper function to pad single digits

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-based, so add 1
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDatePosition(date: string) {
  // Extract the day, month, and year
  const dateParts = date.split('-');

  // Return the formatted date in "dd-MM-yyyy" format
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

/**
 * Converts an ISO date string to the format 'dd-MM-yyyy HH:mm:ss'.
 * @param isoDateString - The ISO date string to format.
 * @returns A string representing the date and time in 'dd-MM-yyyy HH:mm:ss' format.
 */
export function convertIsoToFormattedDate(isoDateString: string): string {
  // Create a Date object from the ISO date string
  if (!isoDateString) return '';
  const date = new Date(isoDateString);

  // Helper function to pad single digits
  const pad = (num: number) => num.toString().padStart(2, '0');

  // Extract date components
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Return formatted date string
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function convertOctetStreamToSvgMime(dataUrl: string): string {
  // Kiểm tra nếu chuỗi bắt đầu với tiền tố 'data:application/octet-stream;base64,'
  const octetStreamPrefix = 'data:application/octet-stream;base64,';
  const svgMimePrefix = 'data:image/svg+xml;base64,';

  if (dataUrl.startsWith(octetStreamPrefix)) {
    // Thay thế tiền tố MIME type bằng 'data:image/svg+xml;base64,'
    return dataUrl.replace(octetStreamPrefix, svgMimePrefix);
  } else {
    console.error('Input is not a valid octet-stream Base64 string');
    return dataUrl; // Hoặc trả về null hoặc lỗi nếu không phù hợp
  }
}

export function removeElementInArray(array: any[], value: any) {
  if (!value) return array;
  const index = array.findIndex((item) => item === value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

// Function để lấy giờ đầu tiên trong ngày với tham số truyền vào
export function getStartOfDay(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date(); // Chuyển đổi dateInput sang Date hoặc sử dụng ngày hiện tại
  date.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây về 0
  return date;
}

// Function để lấy giờ cuối cùng trong ngày với tham số truyền vào
export function getEndOfDay(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date(); // Chuyển đổi dateInput sang Date hoặc sử dụng ngày hiện tại
  date.setHours(23, 59, 59, 999); // Đặt giờ, phút, giây về 23:59:59:999
  return date;
}

// Function để lấy 08:00:00 của ngày hôm trước
export function getEightAMPreviousDay(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date();
  // Lấy ngày hôm trước
  date.setDate(date.getDate() - 1);
  // Đặt giờ về 08:00:00
  date.setHours(8, 0, 0, 0);
  return date;
}

// Function để lấy 08:00:00 của ngày hiện tại
export function getEightAMToday(dateInput?: Date | string): Date {
  const date = dateInput ? new Date(dateInput) : new Date();
  // Đặt giờ về 08:00:00
  date.setHours(8, 0, 0, 0);
  return date;
}

export function calculateDateTimeRange() {
  const startDate = getStartOfDay();
  const endDate = getEndOfDay();

  return {
    startDate,
    endDate,
  };
}

export function generateStartEndDates(period: Period): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case Period.TODAY:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      );
      break;

    case Period.THIS_WEEK:
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startDate = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate(),
        0,
        0,
        0,
      );
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
      break;

    case Period.LAST_WEEK:
      const lastWeekStart = new Date(now);
      lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
      startDate = new Date(
        lastWeekStart.getFullYear(),
        lastWeekStart.getMonth(),
        lastWeekStart.getDate(),
        0,
        0,
        0,
      );
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
      break;

    case Period.THIS_MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;

    case Period.LAST_MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      break;

    case Period.THIS_YEAR:
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;

    case Period.LAST_YEAR:
      startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0);
      endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      break;

    default:
      throw new Error('Invalid period specified');
  }

  return { startDate, endDate };
}
