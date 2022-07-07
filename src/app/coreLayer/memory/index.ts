// @ts-ignore
import Cookies from "js-cookie";

export enum MemoryType {
  localStorage,
  cookie
}

export interface Memory {
  read(key: string): string;
  write(key: string, data: string): void;
  readObject<T>(key: string): T;
  writeObject<T>(key: string, data: T): void;
}

export class MemoryImpl implements Memory {
  readonly memoryType: MemoryType;

  constructor(type?: MemoryType) {
    this.memoryType = type || MemoryType.cookie;
  }

  read(key: string): string {
    return this.getByKey(key) || "";
  }

  write(key: string, data: string) {
    this.writeByKey(key, data);
  }

  readObject<T>(key: string): T {
    let obj = this.getByKey(key);
    if (!obj) {
      return {} as T;
    }
    return JSON.parse(obj) as T;
  }

  writeObject<T>(key: string, data: T) {
    let s = JSON.stringify(data);
    this.writeByKey(key, s);
  }

  private getByKey(key: string): string | undefined | null {
    if (this.memoryType === MemoryType.cookie) {
      return Cookies.get("key");
    } else {
      return localStorage.getItem("key");
    }
  }

  private writeByKey(key: string, data: string) {
    if (this.memoryType === MemoryType.cookie) {
      return Cookies.set("key", data);
    } else {
      return localStorage.setItem("key", data);
    }
  }
}
