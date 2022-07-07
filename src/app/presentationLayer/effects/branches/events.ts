import { createEvent } from "effector";
import { BranchesListFilterI } from "app/businessLogicLayer/models/Branch";

export const updateBranchesListFilter = createEvent<BranchesListFilterI>();
export const resetBranchesListFilter = createEvent();