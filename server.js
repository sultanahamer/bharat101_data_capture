import { createServer } from 'net';
import config from "config";
import { appendFile } from "fs";
import { processPacket } from './packet_processor.js'


var host = config.get("server.host");
var port = config.get("server.port");


let unfinishedPacket = "";

const onData = data => {
  const dataReceived = unfinishedPacket + data.toString('utf8');
  const gpsPackets = dataReceived.split("\n");
  const fullPackets = gpsPackets.splice(0, gpsPackets.length - 1);
  unfinishedPacket = gpsPackets[gpsPackets.length - 1];

  fullPackets.forEach(packet => {
    console.log(packet);
    write_log(packet + "\n");
    processPacket(packet);
  });
}
createServer(sock => {
  sock.on('data', onData);

}).listen(port, host);

console.log("############################ Listner Is Running ############################", host, port);

function write_log(write_content) {
  appendFile('./server-log.txt', write_content, function(err) {
    if (err) { throw err; }
  });
}

