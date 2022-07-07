import { Memory, MemoryImpl, MemoryType } from "app/coreLayer/memory";

export const cookie: Memory = new MemoryImpl(MemoryType.cookie);
export const storage: Memory = new MemoryImpl(MemoryType.localStorage);
