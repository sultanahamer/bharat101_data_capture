import { connectionPool } from "../orm.js";
import { getUtcDateString } from "./date_utils.js";
import { getPlaceHoldersFor } from "./query_utils.js";

const fieldIndexesToIgnore = [0];

const getRowData = (packet) => {
  const data = packet.substr(0, packet.lastIndexOf("*")).split(",");
  const dataWithoutRequiredFields = data.filter((_field, index) => !fieldIndexesToIgnore.includes(index));
  return dataWithoutRequiredFields.concat(getUtcDateString(data));
}

export const addHealthMonitoringPacket = async (packet) => {
  try{
    const rowData = getRowData(packet);
    const connection = await connectionPool.getConnection();
    const queryWithPlaceHolders = `insert into health_monitoring_packets values (${getPlaceHoldersFor(rowData.length)} )`;
    await connection.query(queryWithPlaceHolders, rowData);
    connection.release();
  }
  catch(e) {
    console.error("Error inserting tracking packet into databse", e);
  }
}


