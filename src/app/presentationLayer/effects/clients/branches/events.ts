import { createEvent } from "effector";
import { BranchesListFilterI } from "app/businessLogicLayer/models/Branch";

export const updateBranchesFilter = createEvent<BranchesListFilterI>();
export const resetBranchesFilter = createEvent();