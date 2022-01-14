import { DateTime, FixedOffsetZone } from "luxon";

export const getTimeStampStringFrom = (data, dateFieldIndex, timeFieldIndex) => {
  const timeStampAsString = DateTime.fromFormat(`${data[dateFieldIndex]}${data[timeFieldIndex]}`, "ddMMyyyyHHmmss", {zone: FixedOffsetZone.utcInstance}).toString();
  return timeStampAsString;
}
