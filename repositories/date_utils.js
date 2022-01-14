import { DateTime } from "luxon";

export const getUtcDateString = () => DateTime.utc().toString();

