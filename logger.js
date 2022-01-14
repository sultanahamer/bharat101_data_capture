import log4js from "log4js";
import config from "config";

log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: `${config.get("logging.directoryPath")}/gpscapture.log`,
      maxLogSize: 10485760, // 10MB
      backups: 10, // last 10 files
      compress: true
    }
  },
  categories: {
    default: { appenders: ['everything'], level: 'info' }
  }
});

export const logger =  log4js.getLogger();
