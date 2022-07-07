export interface PaginationResponse<T> {
  content: Array<T>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export class PaginationList {
  content: any;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;

  constructor() {
    this.content = [];
    this.empty = false;
    this.first = false;
    this.last = false;
    this.number = 0;
    this.numberOfElements = 0;
    this.size = 0;
    this.sort = {
      empty: false,
      sorted: false,
      unsorted: false,
    };
    this.totalElements = 0;
    this.totalPages = 0;
  }
}