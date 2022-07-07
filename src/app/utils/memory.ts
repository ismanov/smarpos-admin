//@ts-ignore
import { CookieStorage } from "cookie-storage";

const storage = new CookieStorage({ path: "/" });

const memory = {
  set: (key, o) => storage.setItem(key, o),
  get: key => storage.getItem(key),
  clear: key => storage.removeItem(key),
  clearAll: () => storage.clear()
};

export default memory;
