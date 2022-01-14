import { addLoginPacket } from './repositories/login_packet_repository.js'
import { addTrackingPacket } from './repositories/tracking_packet_repository.js'
import { addHealthMonitoringPacket } from './repositories/health_monitoring_packet_repository.js'
import { logger } from './logger.js'

const HEALTH_MONITORING_PACKET = "HEALTH_MONITORING_PACKET";
const TRACKING_PACKET = "TRACKING_PACKET";
const LOGIN_PACKET = "LOGIN_PACKET";

const packetDescriptors = {
  [LOGIN_PACKET]: { processor: addLoginPacket, numberOfFields: 10, packetType: LOGIN_PACKET },
  [HEALTH_MONITORING_PACKET]: { processor: addHealthMonitoringPacket, numberOfFields: 13, packetType: HEALTH_MONITORING_PACKET },
  [TRACKING_PACKET]: { processor: addTrackingPacket, numberOfFields: 52, packetType: TRACKING_PACKET },
}

const getPacketDescriptor = (packet) => {
  const numberOfFields = packet.split(",").length;
  return Object.values(packetDescriptors).find(handler => handler.numberOfFields == numberOfFields);
}

export const processPacket = (packet) => {
  const packetDescriptor = getPacketDescriptor(packet);
  if (!packetDescriptor) {
    logger.error("Encountered a new packet type. Not handling this, ", packet);
    return;
  }

  packetDescriptor.processor(packet);
}

