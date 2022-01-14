import { connectionPool } from "../orm.js";
import { getUtcDateString } from "./date_utils.js";
import { getTimeStampStringFrom } from "./packet_data_parsing_utils.js";
import { getPlaceHoldersFor } from "./query_utils.js";
import { logger } from '../logger.js'

const fieldIndexesToIgnore = [0, 1, 2, 7, 9, 10];
const dateFieldIndex = 9;
const timeFieldIndex = 10;

const getRowData = (packet) => {
  const data = packet.substr(0, packet.lastIndexOf("*")).split(",");
  const timestampFromPacket = getTimeStampStringFrom(data, dateFieldIndex, timeFieldIndex);
  const dataWithoutRequiredFields = data.filter((field, index) => !fieldIndexesToIgnore.includes(index));
  return dataWithoutRequiredFields.concat(timestampFromPacket, getUtcDateString(data));
}

export const addTrackingPacket = async (packet) => {
  try{
    const rowData = getRowData(packet);
    const connection = await connectionPool.getConnection();
    const queryWithPlaceHolders = `insert into tracking_packets values (${getPlaceHoldersFor(rowData.length)} )`;
    await connection.query(queryWithPlaceHolders, rowData);
    connection.release();
    logger.debug("Saved a tracking packet");
  }
  catch(e) {
    logger.error("Error inserting tracking packet into databse", e);
  }
}

