import { createServer } from 'net';
import config from "config";
import { processPacket } from './packet_processor.js'
import { logger } from './logger.js'


var host = config.get("server.host");
var port = config.get("server.port");


const getDataHandler = () => {
  let unfinishedPacket = "";
  return data => {
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
}

const server = createServer(sock => {
  sock.on("error", (err) => {
    logger.error("Caught error on socket", err);
  });
}).listen(port, host);

server.on('connection', (sock) => {
  sock.on('data', getDataHandler());
});

logger.info("############################ Listner Is Running ############################", host, port);
