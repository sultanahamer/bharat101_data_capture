import { createServer } from 'net';
import config from "config";
import { processPacket } from './packet_processor.js'
import { logger } from './logger.js'


var host = config.get("server.host");
var port = config.get("server.port");


let unfinishedPacket = "";

const onData = data => {
  try {
    const dataReceived = unfinishedPacket + data.toString('utf8');
    const gpsPackets = dataReceived.split("\n");
    const fullPackets = gpsPackets.splice(0, gpsPackets.length - 1);
    unfinishedPacket = gpsPackets[gpsPackets.length - 1];

    fullPackets.forEach(packet => {
      logger.info(packet);
      processPacket(packet);
    });
  }
  catch (e) {
    logger.error("Error while processing data ", data, e);
  }
}
createServer(sock => {
  sock.on('data', onData);
  sock.on("error", (err) => {
    logger.error("Caught error on socket", err);
    unfinishedPacket = "";
  }); 
}).listen(port, host);

logger.info("############################ Listner Is Running ############################", host, port);
