export interface Unit {
  id?: number;
  countable?: boolean;
  description?: string;
  nameRu?: string;
  nameUz?: string;
}

export interface UnitItem {
  id: number;
  name: string;
  nameRu: string;
  nameUz: string;
  description: string;
  code: number
  countable: boolean;
}