import { createPool } from 'mariadb';
import config from "config";

export const connectionPool = createPool({
     host: config.get('database.host'), 
     user: config.get('database.username'), 
     password: config.get('database.password'),
     connectionLimit: config.get('database.connectionLimit'),
     database: config.get('database.database')
});

