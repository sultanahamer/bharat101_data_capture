import { connectionPool } from "../orm.js";
import config from "config";
import { logger } from '../logger.js'

const minute = 60 * 1000;
const vehicleDataRefreshIntervalInMinutes = config.get("vehicleDataFetch.refreshIntervalInMinutes") || 5;

let vehicleRegNosMappedWithImei = {};

const fetchVehiclesData = async () => {
  try{
    const connection = await connectionPool.getConnection();
    const query = `select vehicle, imei from vehicles`;
    const data = await connection.query(query);
    vehicleRegNosMappedWithImei = data.reduce((vehiclesMapSoFar, vehicleData) => ({
      ...vehiclesMapSoFar,
      [vehicleData.imei]: vehicleData.vehicle
    }
    ), {});
    connection.release();
    logger.debug("Successfully fetched vehicle registration to imei mapping");
    return vehicleRegNosMappedWithImei;
  }
  catch(e) {
    logger.error("Error fetching vechicles data", e);
    return Promise.reject(e);
  }
}
export const initialVehicleDataFetchPromise = fetchVehiclesData();
setInterval(fetchVehiclesData, minute * vehicleDataRefreshIntervalInMinutes);

export const getVehicleRegNosMappedWithImei = () => vehicleRegNosMappedWithImei;

