export interface ResultListPaginationModel<T> {
  resultCode: number;
  message: string;
  responseTime: Date;
  data: {
    content: T[];
    pageable: {
      sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
      };
      pageNumber: number;
      pageSize: number;
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    numberOfElements: number;
    size: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    number: number;
    empty: boolean;
  };
}

export interface ResultListNoPaginationModel {
  resultCode: string;
  message: string;
  responseTime: Date;
  data: any[] | any;
}

export interface ResultAPIModel {
  resultCode: string;
  message: string;
  responseTime: Date;
  data: any;
}

export interface ResponseAPI<T> {
  resultCode: number;
  message: string;
  responseTime: number;
  data: T;
}
