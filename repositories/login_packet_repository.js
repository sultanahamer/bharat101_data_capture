import { connectionPool } from "../orm.js";
import { getUtcDateString } from "./date_utils.js";
import { getPlaceHoldersFor } from "./query_utils.js";
import { logger } from '../logger.js'

const fieldIndexesToIgnore = [0];

const getRowData = (packet) => {
  const data = packet.substr(0, packet.lastIndexOf("*")).split(",");
  const dataWithoutRequiredFields = data.filter((field, index) => !fieldIndexesToIgnore.includes(index));
  return dataWithoutRequiredFields.concat(getUtcDateString());
}

export const addLoginPacket = async (packet) => {
  try{
    const rowData = getRowData(packet);
    const connection = await connectionPool.getConnection();
    const queryWithPlaceHolders = `insert into login_packets values (${getPlaceHoldersFor(rowData.length)} )`;
    await connection.query(queryWithPlaceHolders, rowData);
    logger.debug("Saved a login packet");
    connection.release();
  }
  catch(e) {
    logger.error("Error inserting login packet into databse", e);
  }
}

