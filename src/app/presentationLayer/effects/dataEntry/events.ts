import { createEvent } from 'effector';
import { DataEntryFilter } from 'app/businessLogicLayer/models/DataEntryModel';


export const updateFilter = createEvent<DataEntryFilter>();
export const resetStore = createEvent()
export const resetError = createEvent();
